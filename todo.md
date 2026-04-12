# Traffic Agent Management App - TODO

## Autenticação e Segurança
- [x] Configurar Google OAuth com credenciais
- [x] Implementar fluxo de login/logout
- [x] Proteger rotas autenticadas
- [x] Armazenar dados do usuário autenticado

## Schema de Banco de Dados
- [x] Criar tabela de viaturas (id, agente, km_abertura, data_hora, observacoes, user_id)
- [x] Criar tabela de ocorrências (id, tipo, local, descricao, data_hora, agente, user_id)
- [x] Criar tabela de relatórios (id, periodo_inicio, periodo_fim, tipo, data_geracao, user_id)
- [x] Criar tabela de sincronização Google Sheets (id, tipo_registro, registro_id, sheet_id, sincronizado)

## Interface e Design
- [x] Definir tema premium com paleta de cores elegante
- [x] Implementar layout mobile-first responsivo
- [x] Criar componentes base (botões grandes, inputs, cards)
- [x] Implementar navegação por abas (Viatura, Ocorrências, Relatórios)
- [x] Criar layout de sub-menus (Registrar e Histórico)

## Aba Viatura
- [x] Implementar formulário de Registrar (agente, km, data/hora, observações)
- [x] Implementar tela de Histórico com listagem de viaturas
- [x] Validação de formulário
- [x] Testes do módulo Viatura

## Aba Ocorrências
- [x] Implementar formulário de Registrar (tipo, local, descrição, data/hora, agente)
- [x] Implementar tela de Histórico com listagem de ocorrências
- [x] Validação de formulário
- [x] Testes do módulo Ocorrências

## Aba Relatórios
- [x] Implementar tela de Gerar (seleção de período, tipo de relatório)
- [x] Implementar tela de Histórico com listagem de relatórios
- [x] Lógica de geração de relatórios
- [x] Testes do módulo Relatórios

## Painel do Gerente
- [x] Implementar visão geral com total de viaturas do dia
- [x] Exibir total de ocorrências do dia
- [x] Exibir agentes ativos
- [x] Gráficos e estatísticas básicas

## Integração Google Sheets
- [x] Configurar credenciais Google Sheets API
- [x] Implementar função de sincronização para viaturas
- [x] Implementar função de sincronização para ocorrências
- [x] Implementar função de sincronização para relatórios
- [x] Tratamento de erros de sincronização
- [x] Retry automático para sincronizações falhadas

## Testes e Qualidade
- [x] Testes unitários para procedures tRPC
- [x] Testes de integração com Google Sheets (estrutura base implementada)
- [x] Testes de responsividade mobile
- [x] Testes de validação de formulários

## Otimizações e Deploy
- [x] Otimizar performance mobile
- [x] Testar em diferentes dispositivos
- [x] Verificar acessibilidade
- [x] Criar checkpoint final
- [x] Documentar instruções de uso

## Melhorias Solicitadas
- [x] Mover navegação de abas para o topo da página

## Alterações Solicitadas - Sprint 2
- [x] Converter todos os menus para MAIÚsCULA
- [x] Reformular formulário Viatura: Viatura, Condutor, Apoio, Data, KM INICIAL, HORA INICIAL
- [x] Implementar fluxo de finalização de viatura com KM FINAL e HORA FINAL
- [x] Reformular formulário Ocorrências: Viatura, Condutor, Apoio, Código
- [x] Adicionar campo customizável para opção "Outros" em todos os dropdowns

## Alterações Solicitadas - Sprint 3
- [x] Expandir opções de Código em Ocorrências (adicionar opções 16-42 + Outros)
