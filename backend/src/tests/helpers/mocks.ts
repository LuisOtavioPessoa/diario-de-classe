/* Mock padrão de uma turma pertencente ao usuário */
export const fakeOwnedClass = () => ({
    _id: "class123",
    userId: {
        toString: () => "user123",
    },
});

/* Mock padrão de uma turma pertencente a outro usuário */
export const fakeForeignClass = () => ({
    _id: "class123",
    userId: {
        toString: () => "otherUser",
    },
});

