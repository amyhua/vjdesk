import { NextRequest, NextResponse } from "next/server";
import db from "@/db/utils/setupDb";

// Define the GET request handler function
export async function GET(req: NextRequest) {
  // Extract the "id" from the URL by splitting the URL and taking the last element
  const id = req.url.split("/").pop();

  // Log the extracted "id" to the console (for debugging purposes)
  console.log(id);

  try {
    const stmt = db.prepare('SELECT * FROM categories');
    const categories = stmt.all();
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name } = body;
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  try {
    // insert into categories with name of category
    const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
    const info = stmt.run(name);
    return NextResponse.json({ id: info.lastInsertRowid, name }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
