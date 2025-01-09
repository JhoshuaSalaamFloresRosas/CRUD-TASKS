"use server";

const baseUrl = "https://jsonplaceholder.typicode.com/todos";

let currentId = 1;

/**
 * Funcion para devolver las tareas,
 * @param {*} req 
 * @returns 
 */
export async function GET(req) {
  try {
    const response = await fetch(`${baseUrl}?_limit=0`);
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al obtener las tareas" }), { status: 500 });
  }
}

/**
 * Funcion para crear una tarea
 * @param {*} req 
 * @returns 
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return new Response(
        JSON.stringify({ error: "El título es obligatorio" }),
        { status: 400 }
      );
    }

    const newTask = {
      id: currentId++,
      title,
      description: description || null,
      createdAt: new Date().toISOString(),
      status: false,
    };

    return new Response(JSON.stringify(newTask), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al crear la tarea" }),
      { status: 500 }
    );
  }
}

/**
 * Funcion para actualizar la tarea
 * @param {*} req 
 * @returns 
 */
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, description, completed } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "El ID es obligatorio" }),
        { status: 400 }
      );
    }

    const updatedTask = {
      id,
      title: title !== undefined ? title : "Sin título",
      description: description !== undefined ? description : null,
      completed: completed !== undefined ? completed : false,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al actualizar la tarea" }),
      { status: 500 }
    );
  }
}

/**
 * Funcion para eliminar taerra
 * @param {*} req 
 * @returns 
 */
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "El ID es obligatorio" }), { status: 400 });
    }

    await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
    return new Response(JSON.stringify({ message: "Tarea eliminada correctamente" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al eliminar la tarea" }), { status: 500 });
  }
}
