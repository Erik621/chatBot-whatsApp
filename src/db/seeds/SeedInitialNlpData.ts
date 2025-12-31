import { AppDataSource } from "../data-source"; // seu arquivo de conexão TypeORM
import { Intent } from "../entities/nlpBot/Intent";
import { Example } from "../entities/nlpBot/Example";
import { Answer } from "../entities/nlpBot/Answer";

async function seedInitialNlpData() {
    await AppDataSource.initialize();
    
    const intentRepository = AppDataSource.getRepository(Intent);
    const exampleRepository = AppDataSource.getRepository(Example);
    const answerRepository = AppDataSource.getRepository(Answer);

    // Criar Intents
    const saudar = intentRepository.create({ name: 'saudar' });
    const despedir = intentRepository.create({ name: 'despedir' });
    const perguntarHorario = intentRepository.create({ name: 'perguntar_horario' });
    const perguntarNome = intentRepository.create({ name: 'perguntar_nome' });

    await intentRepository.save([saudar, despedir, perguntarHorario, perguntarNome]);

    // Criar Examples
    const examples = [
        { text: 'oi', intent: saudar },
        { text: 'olá', intent: saudar },
        { text: 'bom dia', intent: saudar },
        { text: 'boa tarde', intent: saudar },
        { text: 'boa noite', intent: saudar },
        { text: 'tchau', intent: despedir },
        { text: 'até logo', intent: despedir },
        { text: 'até mais', intent: despedir },
        { text: 'que horas são?', intent: perguntarHorario },
        { text: 'pode me dizer as horas?', intent: perguntarHorario },
        { text: 'qual é o seu nome?', intent: perguntarNome },
        { text: 'quem é você?', intent: perguntarNome },
    ];

    const exampleEntities = examples.map(e => exampleRepository.create(e));
    await exampleRepository.save(exampleEntities);

/* Primeira mensagem: Olá! Bem vindo ao nosso autoatendimento!
Segunda mensagem: Como posso ajudar você?
Terceira mensagem: Para realizar um pedido, basta entrar no link abaixo 👇 */
    
    // Criar Answers
    const answers = [
        { text: 'Olá! Bem vindo ao nosso autoatendimento!', intent: saudar },
        { text: 'Como posso ajudar você?', intent: saudar },
        { text: 'Para realizar um pedido, basta entrar no link abaixo 👇', intent: saudar },
        { text: 'Até logo! Volte sempre.', intent: despedir },
        { text: 'Agora são 12:00.', intent: perguntarHorario }, // depois pode fazer dinâmico
        { text: 'Eu sou seu assistente virtual!', intent: perguntarNome },
    ];

    const answerEntities = answers.map(a => answerRepository.create(a));
    await answerRepository.save(answerEntities);

    console.log('Dados NLP inseridos com sucesso!');
    process.exit(0);
}

seedInitialNlpData().catch(error => console.error(error));
