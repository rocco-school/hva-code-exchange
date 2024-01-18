```mermaid 
classDiagram
class User {
-string firstname
-string lastname
-string username
-string password
-string email

    +getQuestions()
    +getAnswers()
    +save()
    +update()
    +delete()
}

class Post {
    -Date createdAt
    -Date updatedAt

    +save()
    +update()
    +delete()
}

class Question {
    -string questionTitle
    -string questionBody
    -boolean isClosed

    +getUser()
    +getAnswers()
    +getCodingTags()
}

class Answer {
    -string answerBody

    +getQuestion()
    +getUser()
}

class CodingTag {
    -String tagName
    -String tagDescription

    +getQuestions()
    +getUsers()

    +save()
    +update()
    +delete()
}


Question --|> Post
Answer --|> Post

Question "0..*" --* "1" User
Answer "0..*" --* "1" User
CodingTag "0..*" --* "0..*" User

Answer "0..*" --* "1" Question


CodingTag "1..*" --* "0..*" Question