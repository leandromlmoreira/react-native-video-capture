# 🎥 Video Capture

Desafio de projeto **"Captura de Vídeo"** da trilha
[Formação React Native Developer](https://web.dio.me/track/formacao-react-native-developer)
(DIO). Inspirado no projeto de referência do instrutor
([digitalinnovationone/trilha-react-native-expo-video](https://github.com/digitalinnovationone/trilha-react-native-expo-video)).

## O que o projeto faz

- Pede permissão de câmera, microfone e galeria.
- Grava vídeo pela câmera do device (frontal ou traseira, com botão de girar).
- Ao parar de gravar, abre um player (`expo-video`) para reproduzir o vídeo.
- Botões para **salvar na galeria** (`expo-media-library`) ou **compartilhar**
  (`expo-sharing`).

## Tecnologias

- React Native + Expo (SDK 57), TypeScript
- `expo-camera` (gravação), `expo-video` (reprodução — substituiu o `expo-av`
  usado na aula, que está depreciado a partir do Expo SDK 52)
- `expo-media-library`, `expo-sharing`

## Como executar

```bash
npm install
npm run android   # ou ios — recomendado, ver nota abaixo
npm run web       # renderiza e mostra a tela de permissão (ver limitações)
```

## ⚠️ Limitação real e honesta sobre o teste

Este é o único dos 5 desafios de projeto que **precisa de um dispositivo físico
ou emulador Android/iOS** para ser testado de verdade — gravação de vídeo não
é suportada pelo `expo-camera` no modo web, e `expo-media-library` (salvar na
galeria) **não existe na web** (por isso criei `src/mediaLibrary.web.ts`, um
stub que evita quebrar o bundle web e desliga a função "salvar" nesse
ambiente, deixando isso explícito na interface).

O que eu **de fato verifiquei** rodando `npm run web`:
- O app compila e roda sem erros.
- A tela de permissão aparece e o botão "Conceder permissões" dispara o
  pedido de câmera/microfone do navegador corretamente.

O que eu **não pude verificar** (ambiente sem emulador Android/iOS nem
acesso a câmera real neste setup):
- Gravar um vídeo de verdade e reproduzi-lo no player.
- Salvar na galeria e compartilhar.

Se você tem o Android Studio ou um celular com Expo Go, rode
`npm run android` (ou `ios`) para testar o fluxo completo.

## Estrutura

```
src/
├── mediaLibrary.ts       # reexporta expo-media-library (nativo)
└── mediaLibrary.web.ts   # stub para web (Metro escolhe pela plataforma)
App.tsx                   # câmera, gravação, player, salvar/compartilhar
```

## O que aprendi

- **Resolução de arquivo por plataforma do Metro** (`arquivo.web.ts` vs
  `arquivo.ts`): a forma correta de isolar uma dependência nativa que não
  existe na web, sem poluir o componente com `if (Platform.OS === "web")`
  em todo lugar que a usa.
- `expo-av` está sendo substituído por `expo-video`/`expo-audio` a partir do
  SDK 52 — ao seguir uma aula um pouco mais antiga, vale checar a
  documentação atual antes de instalar a dependência "clássica".
- Fluxo de permissões em cadeia (câmera → microfone → galeria), cada uma com
  seu próprio hook (`useCameraPermissions`, `useMicrophonePermissions`,
  `MediaLibrary.usePermissions`), e por que vale agrupar a checagem
  (`permissionsGranted`) em vez de checar cada uma espalhada pelo JSX.
- A importância de **testar de verdade antes de dizer que funciona**: só
  reportar como funcionando o que realmente rodei e vi na tela.
