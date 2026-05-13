"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    shapes = ['X', 'O'];
    goCross = false;
    fields = new Array(9).fill("");
    winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонталь
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикаль
        [0, 4, 8], [2, 4, 6] // диагональ
    ];
    step = 0;
    constructor(goCross = false) {
        this.goCross = goCross;
        console.log(`Первыми будут ходить: ${this.goCross ? "Крестики" : "Нолики"}\n`);
        this.go();
    }
    whoWalking() {
        return this.shapes[this.goCross ? 0 : 1];
    }
    getEnemy() {
        return this.shapes[this.goCross ? 1 : 0];
    }
    randomGo() {
        let clearing = [];
        for (let i = 0; i < this.fields.length; i++) {
            if (this.fields[i] == "") {
                clearing.push(i);
            }
        }
        let res = clearing[Math.floor(Math.random() * clearing.length)];
        return typeof res === "number" ? res : null;
    }
    findLine(shape, count) {
        let res = [];
        let num = 0;
        for (let line of this.winLines) {
            num = 0;
            for (let cell of line) {
                if (this.fields[cell] == shape) {
                    num += 1;
                }
                else if (this.fields[cell] == "") { }
                else {
                    num = 0;
                    break;
                }
            }
            if (num == count) {
                res.push(line);
            }
        }
        return res;
    }
    analizGo() {
        const whoWalking = this.whoWalking(); // определяем кто сейчас ходит
        const enemy = this.getEnemy();
        let canGo = null;
        let findStep = (lines) => {
            for (let line of lines) {
                for (let cell of line) {
                    if (this.fields[cell] == "") {
                        canGo = cell;
                        break;
                    }
                }
                break;
            }
        };
        // Проверяем, есть ли, победные линии т.е. заполнено 2 элемента из 3
        const winSteps = this.findLine(whoWalking, 2);
        if (winSteps.length) {
            // Победная линия имеется
            findStep(winSteps);
        }
        else {
            // Победных линий нет ... Пробуем, найти победные линии у противника!
            const winStepsEnemy = this.findLine(enemy, 2);
            if (winStepsEnemy.length) {
                // У противника есть, победные линии. Испортим её !!
                findStep(winStepsEnemy);
            }
            else {
                // У противника нет победных линий .. Ищем свои фигуры
                const preWinSteps = this.findLine(whoWalking, 1);
                if (preWinSteps.length) {
                    // Есть линии, где находится только одна наша фигура
                    findStep(preWinSteps);
                }
                // Условие ELSE нас не интересует !!
            }
        }
        return canGo;
    }
    amountEmpty() {
        return this.fields.filter(item => item == "").length;
    }
    isFinish() {
        /**
         * Ситуации завершения игры:
         *  1. Одна из линии, заполнена = Победа
         *  2. Не осталось свободных ячеек = Ничья
         */
        const winSteps = this.findLine(this.whoWalking(), 3); // ищем 3 из 3
        if (winSteps.length) {
            console.log("ПОБЕДА !!!");
            return true;
        }
        const emptyCells = this.amountEmpty();
        if (emptyCells == 0) {
            console.log("НИЧЬЯ !!!");
            return true;
        }
        return false;
    }
    render() {
        let text = "";
        let row = 3;
        for (let i = 0; i < this.fields.length; i++) {
            row -= 1;
            if (this.fields[i] == "") {
                text += " * ";
            }
            else {
                text += " " + this.fields[i] + " ";
            }
            if (row == 0) {
                console.log(text);
                text = "";
                row = 3;
            }
        }
        console.log("\n");
    }
    nextStep() {
        // поменять Крестик на Нолик, и наоборот
        this.goCross = !this.goCross;
        let num = this.analizGo();
        if (num == null) {
            num = this.randomGo();
        }
        return num;
    }
    go() {
        let num = this.randomGo(); // первый шаг рандомный
        while (num != null) {
            console.log(`Шаг №${++this.step}`);
            // Поместили фигуру на поле
            this.fields[num] = this.whoWalking();
            // отобразить игровое поле в консоли
            this.render();
            // Проверили, конец игры
            if (this.isFinish())
                break;
            // Определяем следующий шаг
            num = this.nextStep();
            // Защита от бесконечного цикла: больше 9 ходов быть не может
            if (this.step >= 9) {
                console.log("Слишком много ходов ..............");
                break;
            }
        }
    }
}
function start() {
    console.log("Вас приветсвует игра, 'Крестики-Нолики'\n");
    new Game(true); // Первыми ходят Крестики
    console.log("Игра окончена !");
}
start();
//# sourceMappingURL=tictactoe.js.map