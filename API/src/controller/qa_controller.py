# from src.pipeline.qa_pipeline import QAPipeline
from src.model.bart_eli5 import BartEli5


class QA_Controller:

    _bart_eli5 = BartEli5(model_index=0)

    @staticmethod
    def get():
        return "QA Controller"

    @staticmethod
    def get_answers(question, context):
        return QA_Controller._bart_eli5.get_answers(question, context)


# if __name__ == "__main__":
#     print(QA_Controller.get())
