# 📘 Diário de Classe

Aplicação web para professores registrarem o desempenho mensal de alunos de forma digital, substituindo a caderneta física por uma solução simples, prática e organizada.

---

## 🚀 Descrição do Projeto

O **Diário de Classe** foi criado com o objetivo de facilitar o dia a dia de professores, permitindo o registro digital de informações dos alunos de forma rápida e acessível.

A aplicação permite gerenciar turmas, cadastrar alunos e registrar seus desempenhos mensais, além de gerar relatórios em PDF organizados para impressão.

---

## 🎯 Objetivo

* Eliminar o uso de caderneta física
* Reduzir o tempo gasto com preenchimento manual
* Organizar informações por turma e aluno
* Gerar relatórios em PDF de forma simples

---

## 👥 Público-Alvo

* Professores do ensino infantil (MVP)
* Possível expansão para:

  * Ensino fundamental
  * Ensino médio

---

## ⚙️ Tecnologias Utilizadas

### 🖥️ Frontend

* Next.js
* React
* TypeScript
* TailwindCSS

### 🔙 Backend

* Node.js
* Express
* MongoDB

### ☁️ Deploy

* Frontend: Vercel
* Backend: Render

---

## ✨ Funcionalidades

### ✅ MVP

* Cadastro de professor
* Login
* Criação de turmas
* Cadastro de alunos
* Registro de desempenho mensal
* Listagem de alunos por turma
* Geração de PDF por turma

---

### 🔜 Futuras melhorias

* Integração com IA para melhorar textos
* Geração automática de descrições
* Histórico mensal avançado
* Dashboard com métricas

---

## 🏗️ Arquitetura

```
Frontend (Next.js)
        ↓
API REST (Node + Express)
        ↓
MongoDB
```
---

## 🧠 Decisões Técnicas

* Arquitetura em **monorepo** (frontend + backend)
* Separação por **features/modules** para escalabilidade
* Uso de **MongoDB** pela flexibilidade de dados
* Interface focada em **simplicidade e usabilidade**

---

## ⚖️ Trade-offs

* Não utilização de IA no MVP para reduzir complexidade
* Autenticação simples (JWT) ao invés de soluções mais robustas
* Interface minimalista ao invés de design mais elaborado

---

## 🔮 Melhorias Futuras

* Integração com IA
* Melhorias de UX/UI
* Dashboard com métricas
* Filtros por período
* Exportações mais avançadas

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 🙋‍♂️ Autor

Desenvolvido por **Luís Otávio**
