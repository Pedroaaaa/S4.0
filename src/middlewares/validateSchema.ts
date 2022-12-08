import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import Logging from "../library/Logging";
import { IQuestion } from "../models/Question";
import { IList } from "../models/List";
import { IQuizItem } from "../models/QuizItem";
import { IQuiz } from "../models/Quiz";
import { ICharacter } from "../models/Character";

export const validateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error: any) {
      Logging.error(error);
      return res.status(422).json({ message: error.message || error });
    }
  };
};

export const schemas = {
  quiz: {
    create: Joi.object<IQuiz>({
      title: Joi.string().required(),
      itemList: Joi.array()
        .items(
          Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
        )
        .required(),
      difficulty: Joi.number().required(),
      description: Joi.string().required(),
    }),
  },
  quizItem: {
    create: Joi.object<IQuizItem>({
      description: Joi.string().required(),
      list: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      requiredHits: Joi.number().required(),
    }),
  },
  list: {
    create: Joi.object<IList>({
      title: Joi.string().required(),
      description: Joi.string().required(),
      questions: Joi.array()
        .items(
          Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
        )
        .required(),
    }),
  },
  question: {
    create: Joi.object<IQuestion>({
      prompt: Joi.string().required(),
      answers: Joi.array()
        .items({
          text: Joi.string().required(),
          correct: Joi.boolean().required(),
        })
        .has(
          Joi.object().keys({
            text: Joi.string().required(),
            correct: Joi.boolean().invalid(false).required(),
          })
        )
        .required(),
      images: Joi.array().items(
        Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
      ),
      theme: Joi.string().required(),
      character: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      difficulty: Joi.number().required(),
      source: Joi.string().required(),
    }),
  },
  character: {
    create: Joi.object<ICharacter>({
      name: Joi.string().required(),
      portrait: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};
