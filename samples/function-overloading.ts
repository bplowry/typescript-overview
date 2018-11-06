function testFunction(first: number, second: number): object
function testFunction(first: string, second: string): object
function testFunction(first: string | number, second: string | number) {
    return {}
}

const x = testFunction('1', '2')