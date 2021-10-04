**SonarQube**

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jeanbispo_digital-account-challenge&metric=alert_status)](https://sonarcloud.io/dashboard?id=jeanbispo_digital-account-challenge) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jeanbispo_digital-account-challenge&metric=code_smells)](https://sonarcloud.io/dashboard?id=jeanbispo_digital-account-challenge) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jeanbispo_digital-account-challenge&metric=bugs)](https://sonarcloud.io/dashboard?id=jeanbispo_digital-account-challenge) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jeanbispo_digital-account-challenge&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=jeanbispo_digital-account-challenge) [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=jeanbispo_digital-account-challenge&metric=ncloc)](https://sonarcloud.io/dashboard?id=jeanbispo_digital-account-challenge) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jeanbispo_digital-account-challenge&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=jeanbispo_digital-account-challenge) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jeanbispo_digital-account-challenge&metric=security_rating)](https://sonarcloud.io/dashboard?id=jeanbispo_digital-account-challenge) [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=jeanbispo_digital-account-challenge&metric=sqale_index)](https://sonarcloud.io/dashboard?id=jeanbispo_digital-account-challenge) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jeanbispo_digital-account-challenge&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=jeanbispo_digital-account-challenge)

## Descrição

Desafio: Conta Digital proposto pela UME em processo seletivo.

### Decisões técnicas

Escolhi o AdonisJs como framework back-end pelos seguintes motivos:

- Pelo meu domínio técnico com a ferramenta, trabalho com o Adonis há pelo menos 3 anos consecutivos.
- Entendo que não é nescessário reinventar a roda, o framework me entrega uma base sólida e padronizada para construir uma aplicação;
- A construção arquitetural do framework é inspirada no LaravelPHP que por sua vez teve referências do Ruby on Rails, framworks conhecidos pela maioria dos desenvolvedores e já possuem arquiteturas que é familiar a maioria, facilitando o onboarding e o entendimento da mesma.
- O framework me entrega a opção de iniciar uma aplicação na versão slim, sem os drivers de banco de dados, o que era justamente a intenção.

A arquitetura é separada em 3 camadas:

- Model:
  Essa para cada dominio da aplicação com 2 classes, uma para padronizar a estrutura de dados daquele dominio, e outra responsável por armazenar, recuperar e alterar a fila da esturura de dados.

- Services:
  Camada responsável pelas regras de negócio, e recuperar os dados correlacionados de dominios diferentes. Apesar dessa estrutura não vir por padrão no framwork entendo que a maneira mais organizada e correta é separando as regras de negócio em uma camada diferente do Controller.

- Controller:
  Sua responsabilidade é unicamente validar os dados do input, e no caso de serem válidos repassar para o Service.

O porquê do UUID

Padrão e LGPD. Apesar do document ser um dado unitário, resolvi padronizar em todos os dominios o ID de cada entidade. Também entendo que pela LGPD identificar o usuário em todos os estágios da aplicação por um dado sensível do usuário não é a maneira correta do sistema trabalhar, caso precise dividir a aplicação em micro-serviços, transicionar o document entre eles para identificar o usuário é um erro, cada usuário ou conta deve ter seu ID randomico e impessoal de forma que a leitura da iformação não seja associável diretamente a pessoa em questão.

TODO - Coisas que faria se tivesse mais tempo

- Transformaria a camada de services em Classes, construi em função por medo de não conseguir terminar a aplicação a tempo, mas entendo que seria a melhor forma de escrever essa parte da arquitetura principalmente para evitar multiplos instanciamentos das Classes das Models, usando inversão de dependência e evntiando possíveis acoplamentos desnecessários.

- Quebraria algumas funções/métodos em 2 ou mais para reduzir a complexidade

- Revisaria as tipagens, em alguns lugares a tipagem não está completa ainda está com `Promise<all>` por exemplo

- Repensaria o uso do `Event` no dominio de transaction, talvez usar `Promise.all` teria a mesma eficiencia com performance melhor.

- Revisaria as nomenclaturas, algumas variáveis podem ter nomes que refletem melhor sua definição, e claro remover possíveis erros de escrita.

## Tecnologias

- TypeScript
- NodeJs
- AdonisJs
- Japa
- Docker

## Instalação

Instale docker e docker-compose
https://docs.docker.com/compose/install/

Execute o comando para instalar dependências

```bash
$ yarn install
```

## Executando a aplicação com docker

Execute docker pelo docker-compose

```bash
$ docker-compose up -d
```

Lembre-se do parâmetro opcional `-d` para executar em segundo plano

## Executando a aplicação sem docker

```bash
# watch mode
$ yarn dev

# build
$ yarn build

# production mode
$ yarn start
```

## Operação

As Operações podem ser enviadas uma a uma para a rota a seguir, no body de uma requisição POST.

```
http://0.0.0.0:3333/input
```

Também pode ser feito através da documentação do swagger, o que tira a necessidade de usar o Postman ou Insomnia.

```
http://127.0.0.1:3333/docs/index.html#/Input/post_input
```

## URL

O aplicativo é executado na porta 3333

```
http://0.0.0.0:3333
```

## Testes

```bash
# testes
$ yarn test

# lint
$ yarn lint
```

## Documentação

Documentos criados pelo Swagger

```
http://0.0.0.0:3333/docs
```

Importar json para Postman

```
http://0.0.0.0:3333/swagger.json
```
