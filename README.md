# TCC  RHmais FATEC-SO

Trabalho de conclusão de curso RHmais, realizado em grupo para o curso  de Análise e Desenvolvimento de Sistemas,  disponibilzado pela Faculdade de Tecnologia de Sorocaba - Fatec SO.

![](https://lh3.googleusercontent.com/iPGhVyt67zeIUN2cQJMYT2IEjvYo9aS2tKYaQRMt_QhZGzKVT0ndfyzE9SFVxtQzalBnmT1tflxfdSuXyF2UDI3tD8N-45V6AwRTNfTmp_-mqfpY9NbHGXjeWBX5QhZkyWllEVtl84tPK-DZFwYRjxtjHQ1SKBHCrYM3ARLFYx_9SR0Mawp28ApIErOUt4ioIRa_8s6cWlfIBePWC0Zlk-7ihv2EDnEqrsSRoLr0lcoHsQhZEmx1JoOJmyTFNkwOuPIHpVpmThbMFM_bUAb5QsQMGuZo0RETKAAV8_CqAMKTRnarW6iGv4E21xHqGZPVNCo1iGfcgb2RvC-NF7bnPQRDncNkRiNeCBaoYJf2-CnVpafk6_dYzqsqaQ9iGDYZPGb5woWQBkQKeBZLiGF-bE4jKlfmQC17l3Y0xUTq9TWZ0SA9rhkDPUKn3CFwlU1V_iUj9XBvIwYt_SxSodtrxPq48BDbQiZDz8HPcak__Iacq6d6qCOVSPdCdX7s2fvX3CJ_4qyN72TvwdHLMOso7mXYAbzMa7eUO5b4V5RLeVrfDSjnOPW7mx6BCfoKv9GV1L89c1R8rbc65JfuiCCvg4rn5kqQpno2j1ziORieFuw5saUU2U8ibghAnVKitkJrMy-rzr5Eh7LIMlrP-I4K6CJTPiAdR5cqluYsH78X-EUYTscxL8PZ3cHKBUXc=w512-h293-no?authuser=0)


#### Integrantes:  
- Caique Camargo Cesar
- Mateus da Silva Gonçalves
- Paulo Cesar Ferreira Junior 
- Tomas Edson Vasques Coimbra
- Vitor de Jesus Cordeiro

#### Orientadora:
- Prof.ª Mª Denilce de Almeida O.Veloso

#### Objetivo:

Com o intuito de criar uma aplicação para facilitar o controle de cursos e avaliações para os colaboradores de uma determinada empresa.
Foram encontrados alguns problemas na empresa com  relação  à documentação  de desempenho  e  treinamento  dos  seus  colaboradores. Assim  a  proposta  desse  trabalho  foi  desenvolver  um  sistema  que  permita  gerenciar  o treinamento dos colaboradores.
Gerenciamento de cursos a serem ministrados, bem como o acompanhamento dos participantes, suas métricas e avaliações, sejam elas individuais ou em equipe.  

#### Tecnologias: 
Foram utilizadas no desenvolvimento  do projeto as tecnologias:  

##### Back end:
- JavaScript
- Node.Js
- Express - framework de aplicativo da web Node.js
- Banco de Dados MySql
- Passaport - middleware de autenticação para Node.js
- Sequelize - ORM Node.Js


##### Front end:
 - HTML5
 - CSS
 - Bootstrap
 - handlebarsjs - template  engine para Node.js

 ##### Arquitetura : 
 - Api Rest

#### Gerenciamento do projeto:
  O projeto foi desenvolvido utillizando o recurso de  controles,  interfaces,  modelos e rotas.

  **Estrutura do Projeto**
  
  ![](https://lh3.googleusercontent.com/RlxqLsO_N_Q778oDGSxIUDIGZ5ievrXFZv7YTSf-_k-cMj5WkeENu4b3LoXbaEv1r9-B9EUepnyJzhMCc9cxkDk3gYoxxHZO9arRUwOFF4bw_n4josiEcFHSDTy8QrEGtDy_dP81NdIggQ7Od0T5JzxeQjBay0Op7l5sbxuQlZUeveNzpJw4v1wXHZ6WLjWicOcMfsEPhIy68YLJnA0eW0bJEu31eqf2ncPG4BjQ_No6kuXur_FOrOyd9UyX-FtAUQXvXnqvUkpy0QNP6ob3UQmJAKSSqOoetW9Ntv9MBwT8me4b9vewj1yMHEPOi3fStXuee8AiH5fR1o1Q1eBXL4WAH1wmAfsl_hVM6VvyUYP3ItJMHkjjRpAm2BIxlS9Tfxq2vLSwWE_XAItdPpVGVoeTeIH7uJguIFtFP4DYFqFKIJT_5qYpbhgv5GQCleYjCU6dHx4U21HvpJfoQTWRuqRhCvVEDtHsiR3Zc12Ty9dWIc33G9GFeI1AMW6VLcPfBXylUSV1gKIoIe7ts8k9QRuVh5qcNRTiJ0MXgmfZyzVVfkjv88f6Kb7kcw10JXp9HbD0ojOZklVC5oPUeAfFpC4J2utNZmcptdKL_C0n3nC8PYBYojI9qaNh6VxZ52nAiuTL_e8ill1Ip1pUJoyBeiCPpQ2BhHVdk3JzqO_zsjwSOfx9a1ZeC0z1TP-k=w268-h316-no?authuser=0)


  ##### Controles

![](https://lh3.googleusercontent.com/3YqGpF993UayaJOsML0sWUgPyCM0eqq3eE3HDO96_J6FEqc_4C_jE-tQXZBetQqVOpo8o020wZhH89R7hMd9Ys2yuATgi6nYY6QaBu1OZOfj96uQcSmaPgwxHC1JV4sGX35Svyt85DYIbAXW0-mxDQ-LRJai8gF6ObOgtmOEbEslasX8dr9hdobKVECxr0uPAwfcAOImKZbfDnz5PhPhnlOVjQpfbdeW37YR2k7l6OtmHsd1f4O9HA5wqfgMzr7MCWiIqdosj47PYZoXAmqxhI997OLlXmmx0g3KvGkd7zwhWInOtq6CMrZIkQht_4vo3Ujv8HvBfLf5oXJqURMUoUt5ith00FTqQBQZYYalob4ysPmCra_5hHK7qXPftChZWdjweWmyQZNTTLjFoY6qJjN2eku9VFt37a22cN1uo9lUQqlYAGN_Uf-23iNM35x2zdjEIee5v8knm0F62OKoU71QnMZokTWGGFi4qtdJl8ME2GPmB1ALm5xYRS3wrDrWEZ7qKSSB0PvvRd7b0wkel4_SHWQnrYidSRJ9xl6fliq4dIbhSZzSlGW3sM5Q5dBLVsY3rzrg90rgSlgP7I4jsf3Zvv39oQWns3Yx2a784GW4Sca0GI67aWYEFA8IaS2ypyFhlEHeIyF6lDybQ6F0YVybKBiVyr5qJ2yt00ShBvixOLcai40gNntxqQp-=w276-h132-no?authuser=0)

	 Exemplo de controle (JavaScript):


    module.exports = {
    
        listagem(req, res, next) {
            Curso.findAll({
                where: {
                    situacao: 1
                },
                order: [
                    ['nome', 'ASC']
                ]
            }).then((cursos) => {
                res.render('cursos', { cursos: cursos })
            });
        },

 ##### Interfaces

 ![](https://lh3.googleusercontent.com/mUh2jmOZnAdva_5V56llW0Hz08lt1469nzZizdAOr2hdOduqTs6GfTtWLJcXbjU62w07Ai0j5BA32BygbcPIt0d_ijJY9dGCY1Qodt3cSTE4HcP0YmXd8lMe_WZ60Sd4Qm_IbxIV7-zXA43dnfsFlpEJ29S77iKRa9wk2EJbxCY9OiLKPEt4-K59kGC1hSYGA9DTViC_NIKmXFxSVICcofdc4qBe6QmKqDYZWCswKYNmR_myGakcU48t9-5yuSAvEwEjPRpWwiqEXbo722Sc_42AXES8Z6lmDWSrvnLpNjOFsEPvyAJRf0p0U0SmISf1SIhRxxNrwIIDxid99BcSq-XjneEK3kpN6q2aHj-d-FsLRf5uj6PHpu5hXG7mmuJ05btBBtYa0QsF7_txi-yWxJixdmEdApquU-FI84PmMXP7GbNTXjD21iSoPzeg3V6C0Bi4JZXwlCNl-YgT1Fitxrd6-tTFpE0kC2aRC-YrSzclDbUo2rbruOcR2pVhuNBFOSe_XGg3aMvyvkj5fi3CZ_CNqE5FscAcBGcIcRXZREpIgZf83iDkzQLdj34tLqj7ARCoL0rL0MiKvIF_TgYytuVlImlcZXf0uhR4wjjGZDSTTTj1FnImma29LX11xg3CmGJr7W2HarOAq48iRIeofHnr-VWXD9doWJRbKRZpqeEvT_0wJ3rXlXhSO_8B=w285-h508-no?authuser=0)

	  Exemplo de Interface (Html/CSS/Handlebars):
	

    <div class="container mt-4">
    
        <div class="card mt-5">
            <div class="card-header" style="background-color: #836FFF;">
                <h4 class="text-center text-white">Descrição do Colaborador</h4>
            </div>
            <div class="card-body">
                <div class="row mt-4">
                    <div class="col-md-4">
                        <h5 class="card-title"><b>Nome</b>: {{colaborador.dataValues.nome}}</h5>
                    </div>
                    <div class="col-md-4">
                        <h5><b>Cargo</b>: {{colaborador.dataValues.cargo.dataValues.nome}}</h5>
                    </div>
                    <div class="col-md-4">
                        <h5><b>Setor</b>: {{colaborador.dataValues.setor.dataValues.nome}}</h5>
                    </div>
                </div>
    
                <div class="row mt-4">
                    <div class="col-md-8">
                        <h5 class="card-title"><b>E-mail</b>: {{colaborador.dataValues.email}}</h5>
                    </div>
    
                    <div class="col-md-4">
                        <h5 class="card-title"><b>Matricula</b>: {{colaborador.dataValues.matricula}}</h5>
                    </div>
    
                    <div class="col text-center">
                    </div>
    
                </div>
                <br />
            </div>
        </div>
    </div>


 ##### Modelos

 ![](https://lh3.googleusercontent.com/BcaWzAarHB1GUEWn52oh4diNA0J1FuTcyGmDqtlfdNXVKcgrsJJPDIe_n_h3fNvohvuLzuAjL5BR08dbtdHInoj8pbBzxmo7jCLAQh31mcdzm20TIQWC-3L_Y-idm3Jw6HEQ56hVJoTNdHme1SGIuojQObLbt08hFUIxjs8GYI6J5HKZFGlr71_sGXQ7ZYJ2QM9pUyDJCWrt5zHvhc5zv0D0obozfx596ixeZyQWmmiy9qqXm93DqmtWiWiYDXyO8lBdtUIRev7VKl06GBZuhDXKGR-zAhCfsW-bPyA1WEIrjJVrIYnVJn_CjVr5gSl36WjXCN2LPDVmW-pvM8egXgZZ2ybrPHJpLri-hq5jKCI4_2e5LlDXl8AG1HMw67cp4zwrYO9IFPVPmM71cVJyN50WOk1ecUmciwrRkwpPubnmJ713oM_SlmaN9a1bvFIt02uE6Z9xoG831fmNoKZqt3PbUlLaO-m9SiN4xmu0Pvvn8aDnZJLJG4-NiSY3w8d-i6S5kI9BI-EYC9VEDFyaJClJvGfJb39v1AW1mrPesdLg-i7sVj298iOSnN0fmxktlGtwO5y9DRfK8ER7HFXNlQ9-tweEfijL54IbieLQZfCfY4B_z-Gq45boRhaiz0Y4Pkn5FczdxcymbW1WeIawMhhFwjrFH7-y3rsGhQgE4LWyVphvqfyIwtEfuNs_=w288-h347-no?authuser=0)

	  Exemplo de modelo (JavaScript):
	

    const Sequelize = require('sequelize');
    const sequelize = require('../config/db');
    const Setor = require('./setor');
    const Cargo = require('./cargo');
    
    const Colaborador = sequelize.define('colaborador', {
    
        id: {
            field: 'colaboradorId',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    
        nome: {
            field: 'nome',
            type: Sequelize.STRING,
        },
    
        email: {
            field: 'email',
            type: Sequelize.STRING,
        },
    
        senha: {
            field: 'senha',
            type: Sequelize.STRING,
        },
    
        acesso: {
            field: 'acesso',
            type: Sequelize.INTEGER
        },
    
        matricula: {
            field: 'matricula',
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false,
        freezeTableName: true
    })
    
    Setor.hasMany(Colaborador, {
        foreignKey: 'setorId'
    });
    Colaborador.belongsTo(Setor, {
        foreignKey: 'setorId'
    });
    
    Cargo.hasMany(Colaborador, {
        foreignKey: 'cargoId'
    });
    
    Colaborador.belongsTo(Cargo, {
        foreignKey: 'cargoId'
    })
    
    
    module.exports = Colaborador;

 ##### Rotas

 ![](https://lh3.googleusercontent.com/PvG24Xc0cKPLC9PPCYx0x-c09cUiVjLhZ-2pFd45FQbXBDlGf0NndtQ5zdu0NdGtFjAJWacGWP9wBKSMEIc-W40MbjtX4Reh5u4-TexzLAG3_NWIiuPu94MaaT1drc4V85vpjQOBA2_-9DZy9cSMz1t5enDfFHQM5IHZjyoyJ0oNs6z4p8ujkyQ76GsbfYgjmZ59q4TIcVPawcbcerU_NuJb7j25KeH-J1UsOgJ7fg52WCswU-QHC6Q_3z82qfg_lU6n4P4iZs4aMzH3amNCoFqRqgK2qagEFeRmEY51OKIYyX2aX6CGFGhtz2uqXv2rXSPffWPUq0wNhj0lTHiUvLxx9654aHlfMUmpz5KWyqFEdXSoQTpJlS6LCeEqmmkexJxsp9ep2tjwzzodUg0I8oU61JlzGyVX7YWSns43m6SOKpP8AY_YHNhgdmI_8CTBKQ8HBbcnZuBpo4oKrSFvq2QdlUvpxLY8uXd8VTHkUEZO9tEoH5SHPSaHSBtKNKyNVnTaTWwDlBJ_eB2HxPx6h3nm-eornK87zmeKxAnTBOzxRwox7leTkK-hajg_YOvUahlbQOMhEN1PvoodOVKiwbS-Y4C8o0vUizm0uPrfZJveW9BDxo4yREvmoLEB4cdG1ctY6l-YcOHVprtw2j15U9MSykJjICPFmFioDJg7QzPVxXQeFyGV9u7qIpOW=w273-h131-no?authuser=0)

 	Exemplo de rota (JavaScript) :
	

    
    colaboradorRotas.get('/colaboradorExclusao/:id', ColaboradorController.deletar);
    
    colaboradorRotas.get('/login/:id', ColaboradorController.procurar);
    
    colaboradorRotas.post('/colaborador/login', ColaboradorController.login);
    
    //formulário de sugestao de curso
    colaboradorRotas.get('/listagemSugestao', ColaboradorController.listagemSugestoes);


#### Conclusão:

Se você leu até este presente momento, agradeço por ter separado seu tempo e atenção.
O trabalho de conclusão foi muito gratificante pois aprendi vários métodos, técnicas e habilidades, com o apoio dos membros em conjunto com a orientadora, foi um pedaço de tempo que não tem preço todo este aprendizado.
Agradeço novamente você leitor por ver essa pequena experiência que com a união de pessoas maravilhosas chegamos ao fim deste projeto.
