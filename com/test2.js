function calc(N, M) {
    var a = M - (N%M + (M-N%M)%M);
    return ((N - N%M) / M) + 1 - a/M;
}

console.log('1:', calc(15, 3) == 5);
console.log('2:', calc(16, 3) == 6);
console.log('3:', calc(17, 3) == 6);
console.log('4:', calc(18, 3) == 6);
console.log('5:', calc(19, 3) == 7);
console.log('6:', calc(115, 3) == 39);
console.log('7:', calc(17, 6) == 3);
console.log('8:', calc(117, 6) == 20);
console.log('9:', calc(10, 4) == 3);
console.log('10:',calc(11, 4) == 3);
console.log('11:',calc(33, 14) == 3);
console.log('12:',calc(35, 14) == 3);
console.log('13:',calc(28, 14) == 2);
