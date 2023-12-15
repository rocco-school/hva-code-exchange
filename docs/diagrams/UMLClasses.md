```mermaid
---
title: Class Diagram
---
classDiagram
    class User {
        -number userId
        -string firstname
        -string lastname
        -string username
        -string password
        -string email

        +toString()
    }

    class Question {
        -number questionId
        -number userId
        -string questionTitle
        -string questionBody
        -boolean isCLosed
        -Date createdAt
        -Date updatedAt

        +toString()
        +saveQuestion()
        +updateQuestion()
        +getQuestion()
        +retrieveQuestion()
        +insertQuestionTag()
        +deleteQuestion()

    }

    class Answer {
        -number answerId
        -number questionId
        -number userId
        -String answerBody
        -Date createdAt
        -Date updatedAt

        +toString()
    }

    class CodingTag {
        -number tagId
        -String tagName
        -String tagDescription

        +toString()
        +saveCodingTag()
        +updateQuestion()
        +getCodingTags()
        +retrieveCodingTags()
        +deleteCodingTag()

    }

    Question "0..*" ..> "1" User
    Answer "0..*" ..> "1" Question
    Answer "0..*" ..> "1" User
    CodingTag "1..*" ..> "1" Question
    CodingTag "0..*" ..> "1" User