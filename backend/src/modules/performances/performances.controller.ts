import { Request, Response } from "express";
import { Performance } from "./performances.model";
import { Student } from "../students/students.model";
import { Class } from "../classes/classes.model";
import { Types } from "mongoose";

export const create = async (req: Request, res: Response) => {
    try{
        const { studentId, classId, month, year, description } = req.body;

        const classExists = await Class.findById(classId);

        if(!classExists){
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        const student = await Student.findById(studentId);

        if(!student){
            return res.status(404).json({
                message: "Aluno(a) não encontrado(a)",
            });
        }

        // valida se o aluno pertence à turma
        if(student.classId.toString() !== classId){
            return res.status(400).json({
                message: "O aluno(a) não pertence à turma informada.",
            });
        }

        // valida duplicidade de desempenho
        const performanceExists = await Performance.findOne({
            studentId,
            month,
            year,
        });

        if(performanceExists){
            return res.status(409).json({
                message: "Já existe um desempenho para esse aluno nesse mês e ano",
            });
        }

        const performance = await Performance.create({
            studentId,
            classId,
            month,
            year,
            description
        });

        return res.status(201).json({
            message: "Desempenho criado com sucesso",
            data: performance,
        });

    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const listByStudent = async (req: Request, res: Response) => {
    try{
        const studentId = req.params.studentId as string;

        const student = await Student.findById(studentId);

        if(!student){
            return res.status(404).json({
                message: "Aluno(a) não encontrada",
            });
        }

        const performances = await Performance.find({studentId}).sort({ year: -1, month: -1, });

        return res.status(200).json({
            message: "Desempenhos do aluno(a) listados com sucesso",
            data: performances,
        });

    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const getPerformanceByMonth = async (req: Request,res: Response) => {
  try {
    const studentId = req.params.studentId as string;

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Aluno(a) não encontrado(a)",
      });
    }

    const performance = await Performance.findOne({
      studentId,
      month,
      year,
    });

    if (!performance) {
      return res.status(404).json({
        message: "Desempenho não encontrado",
      });
    }

    return res.status(200).json({
      message: "Desempenho específico do(a) aluno(a) listado com sucesso",
      data: performance,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

export const updatePerformance = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;

        const { description } = req.body;

        const performanceUpdate = await Performance.findByIdAndUpdate(
            id,
            {
                description,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if(!performanceUpdate){
            return res.status(404).json({
                message: "Desempenho não encontrado",
            });
        }

        return res.status(200).json({
            message: "Desempenho atualizado com sucesso",
            data: performanceUpdate,
        });
        
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const deletePerformanceById = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;

        const performance = await Performance.findByIdAndDelete(id);

        if(!performance){
            return res.status(404).json({
                message: "Desempenho não encontrado",
            });
        }

        return res.status(200).json({
            message: "Desempenho deletado com sucesso",
        });
        
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });       
    }
}