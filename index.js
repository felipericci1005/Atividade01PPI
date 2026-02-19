import express from 'express';
import { Script } from 'node:vm';


const host = '0.0.0.0';
const porta = 3000;

const server = express();

server.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`);
});

server.get('/', (requisicao, resposta) => {
    resposta.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reajuste de Salário</title>
        </head>
        <body>
            <h2>Informe na url os seguintes dados: http://localhost:3000/validacao?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345</h2>
        </body>
        </html>
    `)
});

server.get('/validacao', (requisicao, resposta) => {
    
    const idade = parseInt(requisicao.query.idade);
    const sexo = requisicao.query.sexo;
    const salario_base = parseFloat(requisicao.query.salario_base);
    const anoContratacao = parseInt(requisicao.query.anoContratacao);
    const matricula = parseInt(requisicao.query.matricula);

    if (idade <= 16 || idade > 99)
    {
        return resposta.send(`<script> alert("Idade inválida (17 até 99 anos)"); </script>`)
    }
    
    else if (sexo != "M" && sexo != "m" && sexo != "F")
    {
        return resposta.send(`<script> alert("Sexo invalido (M ou F)")</script>`)
    }
    
    else if (isNaN(salario_base) || salario_base <= 0)
    {
        return resposta.send(`<script> alert("Valor do salário invalido (Número real válido)") </script>`)
    }

    else if (anoContratacao < 1960)
    {
        return resposta.send(`<script> alert("Ano de contratação invalido (Ano de contratação inteiro e > 1960)") </script>`)
    }

    else if (matricula <= 0)
    {
        return resposta.send(`<script> alert("Matrícula invalida (Matrícula inteira e > 0)") </script>`)
    }

    else
    {
        resposta.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Validacao</title>
        </head>
        <body>
            <h2>Para acessar os dados reajustados sigua a URL: http://localhost:3000/dados?idade=${idade}&sexo=${sexo}&salario_base=${salario_base}&anoContratacao=${anoContratacao}&matricula=${matricula}</h2>
        </body>
        </html>
        `)
    }
});

server.get('/dados', (requisicao,resposta) => {
    
    const idade = parseInt(requisicao.query.idade);
    const sexo = requisicao.query.sexo.toUpperCase();
    const salario_base = parseFloat(requisicao.query.salario_base);
    const anoContratacao = parseInt(requisicao.query.anoContratacao);
    const matricula = parseInt(requisicao.query.matricula);
    let reajuste;
    let desconto;
    let acrescimo;
    let anosempresa;
    let total;
    const anoAtual = 2026;

    anosempresa = anoAtual - anoContratacao;

    if (idade >= 18 && idade <= 39 && sexo == 'M')
    {
        reajuste = 0.1;
        desconto = 10;
        if (anosempresa <=10)
        {
            total = salario_base + (salario_base * reajuste) - desconto;
        }
        else
        {
            acrescimo = 17;
            total = salario_base + (salario_base * reajuste) + acrescimo;
        }
    }

        if (idade >= 18 && idade <= 39 && sexo == 'F')
    {
        reajuste = 0.08;
        desconto = 11;
        if (anosempresa <=10)
        {
            total = salario_base + (salario_base * reajuste) - desconto;
        }
        else
        {
            acrescimo = 16;
            total = salario_base + (salario_base * reajuste) + acrescimo;
        }
    }

        if (idade >=40 && idade <= 69 && sexo == 'M')
    {
        reajuste = 0.08;
        desconto = 5;
        if (anosempresa <=10)
        {
            total = salario_base + (salario_base * reajuste) - desconto;
        }
        else
        {
            acrescimo = 15;
            total = salario_base + (salario_base * reajuste) + acrescimo;
        }
    }

        if (idade >= 40 && idade <= 69 && sexo == 'F')
    {
        reajuste = 0.1;
        desconto = 7;
        if (anosempresa <=10)
        {
            total = salario_base + (salario_base * reajuste) - desconto;
        }
        else
        {
            acrescimo = 14;
            total = salario_base + (salario_base * reajuste) + acrescimo;
        }
    }

        if (idade >= 70 && idade <= 99 && sexo == 'M')
    {
        reajuste = 0.15;
        desconto = 15;
        if (anosempresa <=10)
        {
            total = salario_base + (salario_base * reajuste) - desconto;
        }
        else
        {
            acrescimo = 13;
            total = salario_base + (salario_base * reajuste) + acrescimo;
        }
    }

        if (idade >= 70 && idade <= 99 && sexo == 'F')
    {
        reajuste = 0.17;
        desconto = 17;
        if (anosempresa <=10)
        {
            total = salario_base + (salario_base * reajuste) - desconto;
        }
        else
        {
            acrescimo = 12;
            total = salario_base + (salario_base * reajuste) + acrescimo;
        }
    }

    resposta.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dados</title>
        </head>
        <body>
            <h2> Idade: ${idade}, Sexo: ${sexo}, Salário Base: ${salario_base}, Ano Contratação: ${anoContratacao} e Matricula: ${matricula} </h2>
            <h2> Reajuste: ${total} </h2>
        </body>
        </html>`)
})