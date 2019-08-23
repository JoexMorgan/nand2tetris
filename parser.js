/*
I'm going to create a function called parser that takes Symbolic Assembly language 
(free of any comments or variables)
and return it as a string of 16-bit binary addresses and computations
*/
function parser(data) {
    var instruction = '';
    var tempAddress = '';
    var isTypeACommand = data.charAt(0) == '@';
    if (isTypeACommand) {
        let trimmer = data.split('@');
        trimmer.shift();
        trimmer = Number.parseInt(trimmer);
        tempAddress += trimmer.toString(2);
        if (tempAddress.length < 16) {
            for (var i = 0; i < (16 - tempAddress.length); i++) {
                instruction += '0';
            }
        }
        instruction += tempAddress;
    } else {
        instruction +='111';
        var jump = data.split(';');
        var dest = data.split('=');
        var hasDest = data.split()[0].includes('=');
        var hasJump = data.split()[0].includes(';');
        var compTable = [['0','0101010'],['1','0111111'],['-1','0111010'],['D','0001100'],['A','0110000'],
        ['M','1110000'],['!D','0001100'],['!A','0110011'],['!M','1110011'],['-D','0001111'],['-A','0110011'],
        ['-M','1110011'],['D+1','0011111'],['A+1','0110111'],['M+1','1110111'],['D-1','0001110'],
        ['A-1','0110010'],['M-1','1110010'],['D+A','0000010'],['D+M','1000010'],['D-A','0010011'],
        ['D-M','1010011'],['A-D','0000111'],['M-D','1000111'],['D&A','0000000'],['D&M','1000000'],
        ['D|A','0010101'],['D|M','1010101']];
        var destTable = [['M','001'],['D','010'],['MD','011'],['A','100'],
        ['AM','101'],['AD','110'],['AMD','111']];
        var jumpTable = [['JGT','001'],['JEQ','010'],['JGE','011'],
        ['JLT','100'],['JNE','101'],['JLE','110'],['JMP','111']];
        if (hasDest && hasJump) {
            var target = dest[1].indexOf(';');
            let comp = dest[1].slice(0, target);
            for (let i in compTable) {
                if (comp == compTable[i][0]) {
                    instruction += compTable[i][1];
                }
            }
            for (let j=0; j<7; j++) {
                if (dest[0] == destTable[j][0]) {
                    instruction += destTable[j][1];
                }
            }
            for (let k=0; k<7; k++) {
                if (jump[1] == jumpTable[k][0]) {
                    instruction += jumpTable[k][1];
                }
            } 
        }    else if (hasDest) {
                for (let i in compTable) {
                    if (dest[1] == compTable[i][0]) {
                        instruction += compTable[i][1];
                        for (let j = 0; j<7; j++) {
                            if (dest[0] == destTable[j][0]) {
                                instruction += destTable[j][1];
                                instruction += '000';
                            }
                        }
                    }
                }
            } else {
                for (let i in compTable) {
                    if (jump[0] == compTable[i][0]) {
                        instruction += compTable[i][1];
                    }
                }
                instruction += '000';
                for (let j=0; j<7; j++) {
                    if (jump[1] == jumpTable[j][0]) {
                        instruction += jumpTable[j][1];
                    }
                }
            }
        }
    return instruction;
}
console.log(parser('@420'));
console.log(parser('D=A'));
console.log('You did it! \nA-Commands and C-Commands appear to be parsing accurately. \nAssuming a single line of ASM is passed into parser(), the correct code is returned. \nNow I need to use the nodejs readLine() to take in several lines of ASM');
