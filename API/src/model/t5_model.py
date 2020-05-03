import logging
import tensorflow as tf
from transformers import T5Tokenizer, TFT5ForConditionalGeneration


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


class T5_Model:

    MODELS_T5 = [
        "t5-small",
        "t5-base",
        "t5-large",
        "t5-3b",
        "t5-11b"
    ]

    def __init__(self, model_index=0):
        "Model index can have values in range [0,2] which are equivalent to models: t5-small, t5-base, t5-large"
        logger_name = self.__class__.__name__
        log_file = f"logs/{logger_name}.log"
        self.logger = create_logger(logger_name, log_file)

        self.model_str = self.MODELS_T5[model_index]

        self.tokenizer = T5Tokenizer.from_pretrained(self.model_str)
        self.logger.info("Tokenizer loaded")
        self.model = TFT5ForConditionalGeneration.from_pretrained(
            self.model_str)
        self.logger.info("Model loaded")

    def generate(self, input_ids, hyperparams={}):
        outputs = self.model.generate(input_ids, do_sample=True, **hyperparams)
        all_outputs = []
        if outputs is not None and outputs.shape[0] == 1:
            outputs = self.tokenizer.decode(tf.squeeze(
                outputs), skip_special_tokens=True)
            all_outputs.append(outputs)
        elif outputs is not None:
            all_outputs.extend(
                [self.tokenizer.decode(o, skip_special_tokens=True) for o in outputs])
        return all_outputs

    def get_answers(self, sentence, num_sentences=1):
        input_ids = self.tokenizer.encode(sentence, return_tensors="tf")
        hyperparams = {}
        hyperparams["num_return_sequences"] = num_sentences
        self.logger.info(f"Generating {num_sentences} answers")
        return self.generate(input_ids, hyperparams)


# if __name__ == "__main__":
#     tmp = T5_Model(model_index=1)

#     sentence = """
#     question: What is Coronavirus
#     context: Coronavirus disease 2019 is an infectious disease caused by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). The disease was first identified in December 2019 in Wuhan, the capital of China's Hubei province, and has since spread globally, resulting in the ongoing 2019–20 coronavirus pandemic. As of 26 April 2020, more than 2.89 million cases have been reported across 185 countries and territories, resulting in more than 203,000 deaths. More than 822,000 people have recovered. Common symptoms include fever, cough, fatigue, shortness of breath and loss of smell. While the majority of cases result in mild symptoms, some progress to viral pneumonia, multi-organ failure, or cytokine storm. More concerning symptoms include difficulty breathing, persistent chest pain, confusion, difficulty waking, and bluish skin. The time from exposure to onset of symptoms is typically around five days but may range from two to fourteen days.
#     The virus is primarily spread between people during close contact,[a] often via small droplets produced by coughing,[b] sneezing, or talking. The droplets usually fall to the ground or onto surfaces rather than remaining in the air over long distances. People may also become infected by touching a contaminated surface and then touching their face. In experimental settings, the virus may survive on surfaces for up to 72 hours. It is most contagious during the first three days after the onset of symptoms, although spread may be possible before symptoms appear and in later stages of the disease. The standard method of diagnosis is by real-time reverse transcription polymerase chain reaction (rRT-PCR) from a nasopharyngeal swab. Chest CT imaging may also be helpful for diagnosis in individuals where there is a high suspicion of infection based on symptoms and risk factors; however, guidelines do not recommend using it for routine screening.
#     """.replace("\n", " ")

#     for answer in tmp.get_answers(sentence):
#         print(answer)
