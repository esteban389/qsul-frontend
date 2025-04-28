import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, subDays } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFilter = searchParams.get('time_filter') as 'latest' | 'month' | '30days' | '7days';

    // Get the latest survey version
    const latestSurvey = await prisma.survey.findFirst({
      where: { version: { gt: 0 } },
      orderBy: { version: 'desc' },
      select: { id: true }
    });

    if (!latestSurvey) {
      return NextResponse.json({ total_submissions: 0, ignored_submissions: 0 });
    }

    // Calculate date filters
    let startDate: Date | undefined;
    switch (timeFilter) {
      case 'month':
        startDate = startOfMonth(new Date());
        break;
      case '30days':
        startDate = subDays(new Date(), 30);
        break;
      case '7days':
        startDate = subDays(new Date(), 7);
        break;
      case 'latest':
      default:
        // For latest version, we'll filter by survey ID only
        break;
    }

    // Build the where clause
    const where = {
      survey_id: timeFilter === 'latest' ? latestSurvey.id : undefined,
      created_at: startDate ? { gte: startDate } : undefined
    };

    // Get total submissions
    const totalSubmissions = await prisma.answer.count({
      where
    });

    // Get ignored submissions
    const ignoredSubmissions = await prisma.answer.count({
      where: {
        ...where,
        deleted_at: { not: null }
      }
    });

    return NextResponse.json({
      total_submissions: totalSubmissions,
      ignored_submissions: ignoredSubmissions
    });
  } catch (error) {
    console.error('Error fetching survey stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey statistics' },
      { status: 500 }
    );
  }
} 