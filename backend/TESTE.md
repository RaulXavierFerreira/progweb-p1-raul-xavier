# Testes da API — Projeto 1 (S3)

API: Sistema de Academia · entidades: Aluno e Matricula · servidor: `npm run dev` em http://localhost:3000

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | POST | /alunos | {"nome":"Raul Xavier","email":"raul@uepb.edu.br","cpf":"111.222.333-44"} | 201 | cria aluno (entidade pai) |
| 2 | POST | /matriculas | {"alunoId":1,"plano":"MENSAL","valor":120} | 201 | cria matrícula vinculada ao aluno 1 |
| 3 | GET | /matriculas?alunoId=1 | — | 200 | filtro 1:N por aluno |
| 4 | GET | /matriculas/1 | — | 200 | busca matrícula específica |
| 5 | GET | /matriculas/99 | — | 404 | matrícula inexistente |
| 6 | POST | /alunos | {"nome":"Outro","email":"outro@email.com","cpf":"111.222.333-44"} | 409 | regra: CPF único |
| 7 | POST | /matriculas | {"alunoId":1,"plano":"MENSAL","valor":-50} | 400 | regra: valor > 0 |
| 8 | POST | /matriculas | {"alunoId":999,"plano":"MENSAL","valor":120} | 422 | regra: alunoId precisa existir |
| 9 | PUT | /matriculas/1 | {"plano":"TRIMESTRAL","valor":300} | 200 | atualiza plano e valor |
| 10 | DELETE | /matriculas/1 | — | 204 | remove matrícula |