import os
import logging
import tensorflow as tf
from transformers import pipeline


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


class QAPipeline:

    TASK = "question-answering"
    MODELS = ["distilbert-base-cased-distilled-squad",
              "bert-base-uncased-whole-word-masking-finetuned-squad",
              "albert-base-v2"
              ]
    SCORE_THRESHOLD = 0.75

    def __init__(self, model_index=0, framework="tf"):
        '''Model index can have values in range [0,2] which are equivalent to models:
           bert-base-cased-whole-word-masking-finetuned-squad, distilbert-base-cased-distilled-squad, albert-base-v2'''
        logger_name = self.__class__.__name__
        log_file = f"logs/{logger_name}.log"
        self.logger = create_logger(logger_name, log_file)
        os.chmod(log_file, mode=0o777)

        self.model_str = self.MODELS[model_index]
        self.nlp = pipeline(self.TASK, model=self.model_str,
                            framework=framework)

        self.logger.info("[PIPELINE LOADED]")

    def get_answers(self, inputs):
        # Prepare inputs
        questions = [inputs["question"] for i in range(len(inputs["blocks"]))]
        blocks = inputs["blocks"]

        # Get best answers
        self.logger.info("[GENERATING ANSWERS]")
        results = self.nlp(question=questions, context=blocks)
        results = {x["score"]: x["answer"]
                   for x in results if x["score"] > self.SCORE_THRESHOLD}
        results = dict(sorted(results.items(), reverse=True))

        if len(results) > 0:
            self.logger.info("[ANSWERS GENERATED]")
        else:
            self.logger.info("[ANSWER NOT FOUND]")

        # Return top three answer if possible
        answers = list(results.values())
        return answers if len(answers) < 3 else answers[:3]


# if __name__ == "__main__":
#     tmp = QAPipeline()
