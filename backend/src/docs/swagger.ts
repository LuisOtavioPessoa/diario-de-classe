import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "School Performance API",
            version: "1.0.0",
            description:
             "API para gerenciamento de turmas, alunos e desempenhos escolares. Rotas protegidas utilizam autenticação JWT via Bearer Token.",
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
                            minLength: 8,
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
                            type: "integer",
                            minimum: 2000,
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
                            enum: ["female", "male"],
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
                            example: "6860f4f2d92a4d0f85a6b124",
                        },
                        classId: {
                            type: "string",
                            example: "6860f2e9d92a4d0f85a6b111",
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

                RegisterResponse: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "687e8e8c2b8f6d8c7f8a1234"
                        },
                        name: {
                            type: "string",
                            example: "Luís Otávio"
                        },
                        email: {
                            type: "string",
                            example: "luis@email.com"
                        }
                    }
                },

                LoginResponse: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            example: "jwt.token.aqui"
                        },
                        user: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string",
                                    example: "687e8e8c2b8f6d8c7f8a1234"
                                },
                                name: {
                                    type: "string",
                                    example: "Luís Otávio"
                                },
                                email: {
                                    type: "string",
                                    example: "luis@email.com"
                                }
                            }
                        }
                    }
                },

                StudentResponse: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6860f4f2d92a4d0f85a6b123"
                        },
                        name: {
                            type: "string",
                            example: "Maria Silva"
                        },
                        birthDate: {
                            type: "string",
                            format: "date-time"
                        },
                        gender: {
                            type: "string",
                            enum: ["female", "male"]
                        },
                        disability: {
                            type: "string",
                            nullable: true,
                            example: "TDAH"
                        },
                        classId: {
                            type: "string",
                            example: "6860f2e9d92a4d0f85a6b111"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    }
                },

                ClassResponse: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6860f2e9d92a4d0f85a6b111"
                        },
                        name: {
                            type: "string",
                            example: "6º A"
                        },
                        year: {
                            type: "integer",
                            example: 2026
                        }
                    }
                },

                PerformanceResponse: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6860f9b5d92a4d0f85a6b145"
                        },
                        studentId: {
                            type: "string",
                            example: "6860f4f2d92a4d0f85a6b124"
                        },
                        classId: {
                            type: "string",
                            example: "6860f2e9d92a4d0f85a6b111"
                        },
                        month: {
                            type: "integer",
                            minimum: 1,
                            maximum: 12,
                            example: 6
                        },
                        year: {
                            type: "integer",
                            minimum: 2000,
                            example: 2026
                        },
                        description: {
                            type: "string",
                            example: "Demonstrou evolução significativa em matemática."
                        }
                    }
                },

                UpdateStudentBody: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            example: "João Pedro",
                        },
                        birthDate: {
                            type: "string",
                            format: "date",
                            example: "2013-08-15",
                        },
                        gender: {
                            type: "string",
                            enum: ["female", "male"],
                        },
                        disability: {
                            type: "string",
                            nullable: true,
                            example: "TDAH",
                        },
                    },
                },

                UpdatePerformanceBody: {
                    type: "object",
                    required: ["description"],
                    properties: {
                        description: {
                            type: "string",
                            example: "Excelente evolução no desenvolvimento cognitivo."
                        }
                    }
                },
            },
        },
    },

    apis: [
        "./src/modules/**/*.routes.ts"
    ],
};

export const swaggerSpec = swaggerJsdoc(options);