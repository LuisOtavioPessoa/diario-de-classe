import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "School Performance API",
            version: "1.0.0",
            description:
             "API para gerenciamento de turmas, alunos e desempenhos escolares",
        },

        tags: [
            {
                name: "Auth",
                description: "Autenticação de usuários",
            },
            {
                name: "Classes",
                description: "Gerenciamento de turmas",
            },
            {
                name: "Students",
                description: "Gerenciamento de alunos",
            },
            {
                name: "Performances",
                description: "Gerenciamento de desempenhos",
            },
        ],

        servers: [
            {
                url: "http://localhost:3000",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },

            schemas: {
                RegisterBody: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Luís Otávio",
                        },
                        email: {
                            type: "string",
                            example: "luis@email.com",
                        },
                        password: {
                           type: "string",
                            example: "Senha123", 
                        },
                    },
                },

                LoginBody: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            example: "luis@email.com",
                        },
                        password: {
                            type: "string",
                            example: "Senha123",
                        },
                    },
                },

                CreateClassBody: {
                    type: "object",
                    required: ["name", "year"],
                    properties: {
                        name: {
                            type: "string",
                            example: "6º A",
                        },
                        year: {
                            type: "number",
                            example: 2026,
                        },
                    },
                },

                CreateStudentBody: {
                    type: "object",
                    required: [
                        "name",
                        "birthDate",
                        "gender",
                        "classId",
                    ],
                    properties: {
                        name: {
                            type: "string",
                            example: "Maria Silva",
                        },
                        birthDate: {
                            type: "string",
                            format: "date",
                            example: "2014-05-10",
                        },
                        gender: {
                            type: "string",
                            enum: ["male", "female"],
                        },
                        disability: {
                            type: "string",
                            nullable: true,
                            example: "TDAH",
                        },
                        classId: {
                            type: "string",
                            example: "685c123abc456def789ghi"
                        },
                    },
                },

                CreatePerformanceBody: {
                    type: "object",
                    required: [
                        "studentId",
                        "classId",
                        "month",
                        "year",
                        "description",
                    ],
                    properties: {
                        studentId: {
                            type: "string",
                        },
                        classId: {
                            type: "string",
                        },
                        month: {
                            type: "number",
                            example: 6,
                        },
                        year: {
                            type: "number",
                            example: 2026,
                        },
                        description: {
                            type: "string",
                            example: "Demonstrou evolução significativa em matemática.",
                        },
                    },
                },
            },
        },
    },

    apis: [
        "./src/modules/**/*.routes.ts"
    ],
};

export const swaggerSpec = swaggerJsdoc(options);