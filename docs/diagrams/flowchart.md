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

    class Post {
        -number postId
        -number userId
        -Date createdAt
        -Date updatedAt

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

    class QuestionTag {
        -number questionTagId
        -number questionId
        -number tagId

        +toString()
        +associateTag()
        +disassociateTag()
    }

    User --|> Post
    Question --|> Post
    Answer --|> Post
    Question "1" --* "0..*" QuestionTag
    CodingTag "1" --* "0..*" QuestionTag