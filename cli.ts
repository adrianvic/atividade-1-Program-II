import todo from './core.ts';

const command = process.argv[2];

if (command === "add") {
  const item = process.argv[3];

  if (!item) {
    console.error("Informe um item.");
    process.exit(1);
  }

  await todo.addItem(item);
  console.log(`Item "${item}" adicionado.`);
  process.exit(0);
}

if (command === "list") {
  const items = await todo.getItems();

  if (items.length === 0) {
    console.log("Lista vazia.");
    process.exit(0);
  }

  console.log("Lista de tarefas:");
  items.forEach((item, index) => {
    const status = item.done ? "✔" : "⏳";
    console.log(`${index}: [${status}] ${item.text}`);
  });

  process.exit(0);
}

if (command === "update") {
  const index = parseInt(process.argv[3]);
  const newItem = process.argv[4];

  if (isNaN(index) || !newItem) {
    console.error("Uso: update <index> <novo texto>");
    process.exit(1);
  }

  try {
    await todo.updateItem(index, newItem);
    console.log("Atualizado com sucesso.");
    process.exit(0);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

if (command === "remove") {
  const index = parseInt(process.argv[3]);

  if (isNaN(index)) {
    console.error("Índice inválido.");
    process.exit(1);
  }

  try {
    await todo.removeItem(index);
    console.log("Removido com sucesso.");
    process.exit(0);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

if (command === "done") {
  const index = parseInt(process.argv[3]);

  if (isNaN(index)) {
    console.error("Índice inválido.");
    process.exit(1);
  }

  try {
    await todo.toggleDone(index);
    console.log("Status alterado.");
    process.exit(0);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

console.log(`
Comandos disponíveis:
  add "tarefa"        -> adiciona
  list                -> lista
  update i "texto"    -> atualiza
  remove i            -> remove
  done i              -> marca/desmarca como concluído
`);
process.exit(1);