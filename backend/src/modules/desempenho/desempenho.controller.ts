import { Request, Response } from "express";
import { Desempenho } from "./desempenho.model";
import { Aluno } from "../aluno/aluno.model";
import { Turma } from "../turma/turma.model";
import { Types } from "mongoose";

export const create = async (req: Request, res: Response) => {
    try{
        const { studentId, classId, month, year, description } = req.body;

        if (!Types.ObjectId.isValid(studentId) || !Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                message: "Ids inválidos",
            });
        }

        if(!studentId || !classId || !month || !year || !description){
             return res.status(400).json({
                message: "Dados obrigatórios não enviados",
            });
        }

        const turma = await Turma.findById(classId);

        if(!turma){
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        const aluno = await Aluno.findById(studentId);

        if(!aluno){
            return res.status(404).json({
                message: "Aluno(a) não encontrado(a)",
            });
        }

        // valida se o aluno pertence à turma
        if(aluno.classId.toString() !== classId){
            return res.status(400).json({
                message: "O aluno(a) não pertence à turma informada.",
            });
        }

        // valida duplicidade de desempenho
        const desempenhoExists = await Desempenho.findOne({
            studentId,
            month,
            year,
        });

        if(desempenhoExists){
            return res.status(409).json({
                message: "Já existe um desempenho para esse aluno nesse mês e ano",
            });
        }

        const desempenho = await Desempenho.create({
            studentId,
            classId,
            month,
            year,
            description
        });

        return res.status(201).json({
            message: "Desempenho criado com sucesso",
            data: desempenho,
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

        if(!studentId){
            return res.status(400).json({
                message: "studentId não informado",
            });
        }

        if (!Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                message: "studentId inválido",
            });
        }

        const aluno = await Aluno.findById(studentId);

        if(!aluno){
            return res.status(404).json({
                message: "Aluno(a) não encontrada",
            });
        }

        const desempenhosAluno = await Desempenho.find({studentId}).sort({ year: -1, month: -1, });

        return res.status(200).json({
            message: "Desempenhos do aluno(a) listados com sucesso",
            data: desempenhosAluno,
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

    if (!month || !year) {
      return res.status(400).json({
        message: "month e year são obrigatórios",
      });
    }

    if (!studentId) {
      return res.status(400).json({
        message: "studentId não informado",
      });
    }

    if (!Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        message: "studentId inválido",
      });
    }

    const aluno = await Aluno.findById(studentId);

    if (!aluno) {
      return res.status(404).json({
        message: "Aluno(a) não encontrado(a)",
      });
    }

    const desempenhoEspecifico = await Desempenho.findOne({
      studentId,
      month,
      year,
    });

    if (!desempenhoEspecifico) {
      return res.status(404).json({
        message: "Desempenho não encontrado",
      });
    }

    return res.status(200).json({
      message: "Desempenho específico do(a) aluno(a) listado com sucesso",
      data: desempenhoEspecifico,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

export const updateDesempenho = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;

        const { description } = req.body;

        if(!id){
            return res.status(400).json({
                message: "Id não informado",
            });
        }

        if(!Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Id inválido",
            });
        }

        if (!description) {
        return res.status(400).json({
            message: "Descrição não enviada",
        });
        }

        const desempenhoUpdate = await Desempenho.findByIdAndUpdate(
            id,
            {
                description,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if(!desempenhoUpdate ){
            return res.status(404).json({
                message: "Desempenho não encontrado",
            });
        }

        return res.status(200).json({
            message: "Desempenho atualizado com sucesso",
            data: desempenhoUpdate,
        });
        
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const deleteDesempenhoById = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;

        if(!id){
            return res.status(400).json({
                message: "Id não informado",
            });
        }

        if(!Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Id inválido",
            });
        }

        const desempenho = await Desempenho.findByIdAndDelete(id);

        if(!desempenho){
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