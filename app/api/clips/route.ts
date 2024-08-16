import { NextRequest, NextResponse } from "next/server";
import db from "@/db/utils/setupDb";

// Define the GET request handler function
export async function GET(req: NextRequest) {
  // Extract the "id" from the URL by splitting the URL and taking the last element
  const id = req.url.split("/").pop();

  // Log the extracted "id" to the console (for debugging purposes)
  console.log(id);

  try {
    const stmt = db.prepare('SELECT * FROM clips');
    const clips = stmt.all();
    return NextResponse.json(clips);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { file, vote, categories } = body;
  const id = (isNaN(parseInt(body.id ?? ''))) ? '' : body.id;

  if (!file) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  const updateRecord = (id: string) => {
    if (!vote && categories) {
      const stmt = db.prepare('UPDATE clips SET categories = ? WHERE id = ?');
      stmt.run(categories, id);
      return NextResponse.json({ id, file, categories }, { status: 200 });
    }
    if (vote && !categories) {
      const stmt = db.prepare('UPDATE clips SET vote = ? WHERE id = ?');
      stmt.run(vote, id);
      return NextResponse.json({ id, file, vote }, { status: 200 });
    } else if (vote && categories) {
      const stmt = db.prepare('UPDATE clips SET vote = ?, categories = ? WHERE id = ?');
      stmt.run(vote, categories, id);
      return NextResponse.json({ id, file, vote, categories }, { status: 200 });
    }
  };

  try {
    // if id is provided, update the vote
    if (id) {
      return updateRecord(id); 
    }
    // if a clip with same file exists, update that instead
    const stmtCheck = db.prepare('SELECT * FROM clips WHERE file = ?');
    const clip = stmtCheck.get(file) as { id: string };
    if (clip) {
      return updateRecord(clip.id);
    }
    // create record
    const stmt = db.prepare('INSERT INTO clips (file, vote) VALUES (?, ?)');
    const info = stmt.run(file, vote);
    return NextResponse.json({ id: info.lastInsertRowid, file, vote }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
