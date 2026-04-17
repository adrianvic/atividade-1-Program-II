import todoService from "./core";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonFilePath = __dirname + '/data.todo.json';
const port = 3000;

const server = Bun.serve({
  port: port,
  async fetch(request: Request) {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // GET /items - listar todos os itens
    if (pathname === "/items" && method === "GET") {
      try {
        const items = await todoService.getItems();
        return new Response(JSON.stringify(items), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch items" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // POST /items - adicionar novo item
    if (pathname === "/items" && method === "POST") {
      try {
        const body = await request.json();
        const { text } = body;
        
        if (!text || typeof text !== "string") {
          return new Response(JSON.stringify({ error: "Text field is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        await todoService.addItem(text);
        const items = await todoService.getItems();
        
        return new Response(JSON.stringify({ 
          message: "Item added successfully", 
          item: items[items.length - 1] 
        }), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to add item" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // PUT /items?index=0 - atualizar item
    if (pathname === "/items" && method === "PUT") {
      try {
        const index = parseInt(searchParams.get("index") || "");
        
        if (isNaN(index)) {
          return new Response(JSON.stringify({ error: "Invalid index parameter" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== "string") {
          return new Response(JSON.stringify({ error: "Text field is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        await todoService.updateItem(index, text);
        const items = await todoService.getItems();

        return new Response(JSON.stringify({ 
          message: "Item updated successfully", 
          item: items[index] 
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message || "Failed to update item" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // PATCH /items?index=0 - toggle done status
    if (pathname === "/items" && method === "PATCH") {
      try {
        const index = parseInt(searchParams.get("index") || "");
        
        if (isNaN(index)) {
          return new Response(JSON.stringify({ error: "Invalid index parameter" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        await todoService.toggleDone(index);
        const items = await todoService.getItems();

        return new Response(JSON.stringify({ 
          message: "Item toggled successfully", 
          item: items[index] 
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message || "Failed to toggle item" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // DELETE /items?index=0 - remover item
    if (pathname === "/items" && method === "DELETE") {
      try {
        const index = parseInt(searchParams.get("index") || "");
        
        if (isNaN(index)) {
          return new Response(JSON.stringify({ error: "Invalid index parameter" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        await todoService.removeItem(index);
        
        return new Response(JSON.stringify({ message: "Item removed successfully" }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message || "Failed to remove item" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
});

console.log(`Servidor rodando em http://localhost:${port}`);