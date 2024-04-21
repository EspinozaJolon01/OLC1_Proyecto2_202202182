export default class Ast {
    private static instancia: Ast
    private count: number

    private constructor() {
        this.count = 0
    }

    public static getInstancia(): Ast {
        if (!Ast.instancia) {
            Ast.instancia = new Ast()
        }
        return Ast.instancia
    }

    get() {
        this.count++
        return this.count
    }

}