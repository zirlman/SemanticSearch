import logging
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch


def setup_logger(logger_name, log_file, level=logging.INFO):
    l = logging.getLogger(logger_name)
    formatter = logging.Formatter('%(asctime)s : %(message)s')
    if log_file:
        streamHandler = logging.StreamHandler()
        streamHandler.setFormatter(formatter)
        fileHandler = logging.FileHandler(log_file, mode='w')
        fileHandler.setFormatter(formatter)

    l.setLevel(level)
    if log_file:
        l.addHandler(streamHandler)
        l.addHandler(fileHandler)


def create_logger(logger_name, log_file, level=logging.INFO):
    logger_name = "CompuMethodsFix"
    setup_logger(logger_name, log_file, level)
    return logging.getLogger(logger_name)


class BartEli5:

    MODELS_BART = [
        "yjernite/bart_eli5"
    ]

    def __init__(self, model_index=0):
        "Model index can have values in range [0,2] which are equivalent to models: t5-small, t5-base, t5-large"
        logger_name = self.__class__.__name__
        log_file = f"logs/{logger_name}.log"
        self.logger = create_logger(logger_name, log_file)

        self.model_str = self.MODELS_BART[model_index]

        self.tokenizer = AutoTokenizer.from_pretrained(self.model_str)
        self.logger.info("Tokenizer loaded")
        self.model = AutoModelForSeq2SeqLM.from_pretrained(
            self.model_str)
        self.logger.info("Model loaded")

    def prepare_inputs(self, questions, max_len=64, max_a_len=360, device="cuda"):
        q_enc = self.tokenizer.batch_encode_plus(
            questions, max_length=max_len, return_tensors="pt", truncation=True, pad_to_max_length=True)
        q_ids, q_mask = q_enc["input_ids"].to(
            device), q_enc["attention_mask"].to(device)

        model_inputs = {
            "input_ids": q_ids,
            "attention_mask": q_mask
        }
        return model_inputs

    def qenerate(self, question_doc, num_answers=1, num_beams=None, min_len=64, max_len=256, do_sample=False, temp=1.0, top_p=None, top_k=None, max_input_length=512, device="cuda"):
        model_inputs = self.prepare_inputs(
            [question_doc], max_input_length, device=device)
        n_beams = num_answers if num_beams is None else max(
            num_beams, num_answers)

        generated_ids = self.model.generate(
            input_ids=model_inputs["input_ids"],
            attention_mask=model_inputs["attention_mask"],
            min_length=min_len,
            max_length=max_len,
            do_sample=do_sample,
            early_stopping=True,
            num_beams=1 if do_sample else n_beams,
            temperature=temp,
            top_k=top_k,
            top_p=top_p,
            eos_token_id=qa_s2s_tokenizer.eos_token_id,
            no_repeat_ngram_size=3,
            num_return_sequences=num_answers,
            decoder_start_token_id=qa_s2s_tokenizer.bos_token_id,
        )

        return [qa_s2s_tokenizer.decode(ans_ids, skip_special_tokens=True).strip() for ans_ids in generated_ids]

    def get_answers(self, question, context, num_answers=1, sampled="beam", min_len=0, max_len=256, sampling=False, n_beams=2, top_p=0.95, temp=0.8):
        model_input = "question: {} context: {}".format(question, context)
        device = "cuda" if torch.cuda.is_available() else "cpu"

        answer = self.qenerate(
            model_input,
            num_answers=num_answers,
            num_beams=n_beams,
            min_len=min_len,
            max_len=max_len,
            do_sample=sampling,
            temp=temp,
            top_p=top_p,
            top_k=None,
            max_input_length=1024,
            device=device)

        return answer
