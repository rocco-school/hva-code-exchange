```mermaid
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
        -string questionTitle
        -string questionBody
        -boolean isClosed

        +toString()
        +saveQuestion()
        +updateQuestion()
        +getQuestion()
        +retrieveQuestion()
        +insertQuestionTag()
        +deleteQuestion()
    }

    class Answer {
        -string answerBody

        +toString()
    }

    class CodingTag {
        -number tagId
        -String tagName
        -String tagDescription

        +toString()
        +saveCodingTag()
        +getCodingTags()
        +retrieveCodingTags()
        +deleteCodingTag()
    }


    User "1" --* "0..*" Question
    User "1" --* "0..*" Answer

    Question "1" --* "0..*" Answer

    User "1" --* "0..*" Post
    Question --|> Post
    Answer --|> Post
    Question "0..*" --* "1..*" CodingTag
    User "0..*" --* "0..*" CodingTag
