import { NextResponse } from "next/server";
import { database } from "@/database/migrations/client";

export async function GET() {
  try {
    const result = await database.query<{
      current_time: Date;
      database_name: string;
    }>(
      `
        SELECT
          NOW() AS current_time,
          current_database() AS database_name
      `,
    );

    return NextResponse.json({
      success: true,
      message: "PostgreSQL connection successful.",
      database: result.rows[0].database_name,
      currentTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not connect to PostgreSQL.",
      },
      {
        status: 500,
      },
    );
  }
}