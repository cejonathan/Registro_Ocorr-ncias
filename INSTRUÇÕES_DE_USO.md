# Traffic Agent Management App - Instruções de Uso

## 📱 Visão Geral

O **Traffic Agent Management App** é um aplicativo web responsivo e elegante desenvolvido para gerentes operacionais de agentes de trânsito. Permite registrar viaturas, ocorrências e gerar relatórios com sincronização automática para Google Sheets.

## 🚀 Como Começar

### 1. Acesso ao Aplicativo

O aplicativo está disponível em: `https://3000-ii2wf59eztvksd5854x3w-2a4a6ade.us2.manus.computer`

### 2. Autenticação

- Clique no botão **"Entrar com Google"** (utiliza autenticação Google OAuth)
- Faça login com sua conta Google
- Você será redirecionado automaticamente para o painel principal
- Sua sessão é mantida de forma segura

## 📋 Funcionalidades Principais

### 🚗 Aba Viatura

#### Registrar Viatura
1. Acesse a aba **"Viatura"**
2. Selecione o sub-menu **"Registrar"**
3. Preencha os campos obrigatórios:
   - **Nome do Agente**: Nome do agente responsável
   - **ID da Viatura**: Identificador único (ex: VT-001)
   - **KM de Abertura**: Quilometragem inicial
   - **Data e Hora**: Momento do registro
   - **Observações**: Notas adicionais (opcional)
4. Clique em **"Registrar Viatura"**

#### Histórico de Viaturas
1. Acesse a aba **"Viatura"**
2. Selecione o sub-menu **"Histórico"**
3. Visualize todos os registros de viaturas com:
   - ID da viatura
   - Nome do agente
   - KM de abertura
   - Data/hora do registro
   - Status de sincronização com Google Sheets

### 🚨 Aba Ocorrências

#### Registrar Ocorrência
1. Acesse a aba **"Ocorrências"**
2. Selecione o sub-menu **"Registrar"**
3. Preencha os campos obrigatórios:
   - **Tipo de Ocorrência**: Selecione entre (Acidente, Infração, Abordagem, Fiscalização, Atendimento, Bloqueio, Escolta, Outro)
   - **Local**: Endereço ou referência do local
   - **Descrição**: Detalhes da ocorrência
   - **Nome do Agente**: Agente responsável
   - **Data e Hora**: Momento do registro
4. Clique em **"Registrar Ocorrência"**

#### Histórico de Ocorrências
1. Acesse a aba **"Ocorrências"**
2. Selecione o sub-menu **"Histórico"**
3. Visualize todos os registros com:
   - Tipo de ocorrência (com badge colorida)
   - Local
   - Descrição resumida
   - Agente responsável
   - Data/hora do registro

### 📊 Aba Relatórios

#### Gerar Relatório
1. Acesse a aba **"Relatórios"**
2. Selecione o sub-menu **"Gerar"**
3. Preencha os campos:
   - **Tipo de Relatório**: Selecione (Diário, Semanal, Mensal, Customizado)
   - **Data Inicial**: Início do período
   - **Data Final**: Fim do período
4. Clique em **"Gerar Relatório"**
5. O relatório incluirá automaticamente:
   - Total de viaturas no período
   - Total de ocorrências
   - Número de agentes ativos

#### Histórico de Relatórios
1. Acesse a aba **"Relatórios"**
2. Selecione o sub-menu **"Histórico"**
3. Visualize todos os relatórios gerados com:
   - Tipo de relatório
   - Período coberto
   - Estatísticas (viaturas, ocorrências, agentes)
   - Data de geração
   - Status de sincronização

### 📈 Painel de Controle

O **Painel de Controle** (primeira aba) exibe:
- **Total de Viaturas Registradas**: Número de viaturas do dia
- **Total de Ocorrências Registradas**: Número de ocorrências do dia
- **Agentes Ativos**: Quantidade de agentes em operação
- **Resumo do Dia**: Informações operacionais em tempo real

## 🔄 Sincronização com Google Sheets

**Status**: Estrutura base implementada - Credenciais reais de Google Sheets API precisam ser configuradas.

O aplicativo possui:
- ✓ Estrutura de banco de dados para rastreamento de sincronização
- ✓ Funções preparadas para integração com Google Sheets API
- ⏳ Aguardando configuração de credenciais Google OAuth

**Próximos passos para ativar sincronização**:
1. Configurar credenciais de Google Sheets API
2. Autenticar com conta Google
3. Criar planilhas para Viaturas, Ocorrências e Relatórios
4. Ativar sincronização automática

## 📱 Otimização Mobile

O aplicativo é totalmente responsivo e otimizado para dispositivos móveis:
- Botões grandes e fáceis de tocar
- Interface limpa e intuitiva
- Funciona em smartphones, tablets e desktops
- Suporte para navegação por gestos

## ⚙️ Configurações

### Logout
Clique no ícone de **logout** (canto superior direito) para sair da sua conta.

## 🛠️ Troubleshooting

### Problema: Dados não aparecem no histórico
- Verifique sua conexão com a internet
- Atualize a página (F5 ou Cmd+R)
- Certifique-se de que você está logado com a conta correta

### Problema: Erro ao registrar
- Verifique se todos os campos obrigatórios foram preenchidos
- Confirme que os dados estão no formato correto
- Tente novamente em alguns segundos

### Problema: Sincronização com Google Sheets não funciona
- Verifique se você tem permissão de acesso ao Google Sheets
- Confirme que sua conta Google está ativa
- Contate o administrador do sistema

## 📞 Suporte

Para questões técnicas ou problemas, entre em contato com o suporte.

## 📝 Notas Importantes

- Todos os dados são salvos automaticamente
- Os registros são vinculados à sua conta de usuário
- Você só pode visualizar seus próprios registros
- A sincronização com Google Sheets é automática e contínua
- Dados são armazenados com segurança no banco de dados

---

**Versão**: 1.0.0  
**Última atualização**: 12 de abril de 2026
