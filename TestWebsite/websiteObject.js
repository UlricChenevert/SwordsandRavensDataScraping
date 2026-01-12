class TestClass {
    constructor () {
        this.data1 = "1"
        this.data2 = 1
        this.data3 = this
    }

    function1 () {
        console.debug("Function 1")
    }

    function2 () {
        console.debug("Function 2")
    }

    function3 () {
        console.debug("Function 3")
    }
}

window.gameClient = new TestClass(); 

setInterval(()=>{window.gameClient.function1()}, 1000)

setInterval(()=>{window.gameClient.function2()}, 2000)

setInterval(()=>{window.gameClient.function3()}, 3000)

console.log("Hackable website ready")