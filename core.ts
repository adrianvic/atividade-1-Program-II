const jsonFilePath = __dirname + '/data.todo.json';

type TodoItem = {
  text: string;
  done: boolean;
};

const list: TodoItem[] = await loadFromFile();

async function loadFromFile(): Promise<TodoItem[]> {
  try {
    const file = Bun.file(jsonFilePath);
    const content = await file.text();
    return JSON.parse(content) as TodoItem[];
  } catch (error: any) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function saveToFile() {
  try {
    await Bun.write(jsonFilePath, JSON.stringify(list, null, 2));
  } catch (error: any) {
    throw new Error("Erro ao salvar: " + error.message);
  }
}

async function addItem(item: string) {
  list.push({ text: item, done: false });
  await saveToFile();
}

async function getItems() {
  return list;
}

async function updateItem(index: number, newItem: string) {
  if (index < 0 || index >= list.length)
    throw new Error("Index fora dos limites");

  list[index].text = newItem;
  await saveToFile();
}

async function removeItem(index: number) {
  if (index < 0 || index >= list.length)
    throw new Error("Index fora dos limites");

  list.splice(index, 1);
  await saveToFile();
}

async function toggleDone(index: number) {
  if (index < 0 || index >= list.length)
    throw new Error("Index fora dos limites");

  list[index].done = !list[index].done;
  await saveToFile();
}

export default {
  addItem,
  getItems,
  updateItem,
  removeItem,
  toggleDone
};