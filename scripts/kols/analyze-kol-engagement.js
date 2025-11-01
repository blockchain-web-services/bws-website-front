import {
  loadKolsData,
  loadRepliesData,
  loadMetricsData,
  saveMetricsData,
  formatNumber
} from './utils/kol-utils.js';
import {
  createClaudeClient,
  analyzeEngagementPatterns
} from './utils/claude-client.js';

/**
 * Main Analytics Script
 * Analyzes KOL engagement performance and generates reports
 */

async function analyzeEngagement() {
  console.log('🚀 Starting KOL Engagement Analysis...\n');

  // Load data
  const kolsData = loadKolsData();
  const repliesData = loadRepliesData();
  const metricsData = loadMetricsData();

  if (kolsData.kols.length === 0) {
    console.log('❌ No KOLs in database. Run discover-kols.js first.');
    process.exit(1);
  }

  if (repliesData.replies.length === 0) {
    console.log('⚠️  No replies in database yet. Analytics will be limited.');
  }

  console.log(`📊 Data loaded:
   - Total KOLs: ${kolsData.kols.length}
   - Active KOLs: ${kolsData.kols.filter(k => k.status === 'active').length}
   - Total Replies: ${repliesData.replies.length}
   - Successful Replies: ${repliesData.replies.filter(r => r.status === 'posted').length}
\n`);

  // Calculate weekly report
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekStart = oneWeekAgo.toISOString().split('T')[0];
  const weekEnd = now.toISOString().split('T')[0];

  console.log(`📅 Analyzing week: ${weekStart} to ${weekEnd}\n`);

  // Filter replies from this week
  const weekReplies = repliesData.replies.filter(r =>
    new Date(r.timestamp) >= oneWeekAgo
  );

  console.log(`   Replies this week: ${weekReplies.length}`);

  // Calculate metrics
  const successfulReplies = weekReplies.filter(r => r.status === 'posted');
  const failedReplies = weekReplies.filter(r => r.status === 'failed');
  const successRate = weekReplies.length > 0
    ? (successfulReplies.length / weekReplies.length * 100).toFixed(1)
    : 0;

  const avgRelevanceScore = weekReplies.length > 0
    ? (weekReplies.reduce((sum, r) => sum + r.relevanceScore, 0) / weekReplies.length).toFixed(1)
    : 0;

  // Product distribution
  const productDistribution = {};
  const productEngagement = {};

  weekReplies.forEach(r => {
    if (r.productMentioned) {
      productDistribution[r.productMentioned] = (productDistribution[r.productMentioned] || 0) + 1;

      if (!productEngagement[r.productMentioned]) {
        productEngagement[r.productMentioned] = {
          mentions: 0,
          totalEngagement: 0,
          topKol: null,
          maxEngagement: 0
        };
      }

      productEngagement[r.productMentioned].mentions++;

      const engagement = (r.engagement?.likes || 0) +
                        (r.engagement?.retweets || 0) +
                        (r.engagement?.replies || 0);

      productEngagement[r.productMentioned].totalEngagement += engagement;

      if (engagement > productEngagement[r.productMentioned].maxEngagement) {
        productEngagement[r.productMentioned].maxEngagement = engagement;
        productEngagement[r.productMentioned].topKol = r.kolUsername;
      }
    }
  });

  // Calculate average engagement per product
  Object.keys(productEngagement).forEach(product => {
    const data = productEngagement[product];
    data.avgEngagement = data.mentions > 0
      ? (data.totalEngagement / data.mentions).toFixed(1)
      : 0;
  });

  // Top engaging KOLs
  const kolEngagementMap = {};

  weekReplies.forEach(r => {
    if (!kolEngagementMap[r.kolUsername]) {
      kolEngagementMap[r.kolUsername] = {
        username: r.kolUsername,
        replies: 0,
        totalEngagement: 0,
        topics: new Set()
      };
    }

    kolEngagementMap[r.kolUsername].replies++;

    const engagement = (r.engagement?.likes || 0) +
                      (r.engagement?.retweets || 0) +
                      (r.engagement?.replies || 0);

    kolEngagementMap[r.kolUsername].totalEngagement += engagement;

    // Get KOL topics
    const kol = kolsData.kols.find(k => k.username === r.kolUsername);
    if (kol && kol.recentTopics) {
      kol.recentTopics.forEach(topic => kolEngagementMap[r.kolUsername].topics.add(topic));
    }
  });

  const topEngagingKols = Object.values(kolEngagementMap)
    .map(k => ({
      username: k.username,
      replies: k.replies,
      avgEngagement: (k.totalEngagement / k.replies).toFixed(1),
      topics: Array.from(k.topics)
    }))
    .sort((a, b) => parseFloat(b.avgEngagement) - parseFloat(a.avgEngagement))
    .slice(0, 10);

  // Spam indicators
  const spamIndicators = {
    blockedCount: 0, // Would need to track this separately
    mutedCount: 0, // Would need to track this separately
    reportedCount: 0, // Would need to track this separately
    lowEngagementRate: failedReplies.length / (weekReplies.length || 1) * 100
  };

  // Build weekly report
  const weeklyReport = {
    weekStart,
    weekEnd,
    totalReplies: weekReplies.length,
    successRate: parseFloat(successRate),
    averageRelevanceScore: parseFloat(avgRelevanceScore),
    productPerformance: {},
    topEngagingKols,
    spamIndicators
  };

  // Format product performance
  Object.keys(productEngagement).forEach(product => {
    const data = productEngagement[product];
    weeklyReport.productPerformance[product] = {
      mentions: data.mentions,
      avgEngagement: parseFloat(data.avgEngagement),
      topKol: data.topKol
    };
  });

  // Use Claude for deeper analysis
  console.log('🤖 Running AI analysis with Claude...\n');

  const claudeClient = createClaudeClient();
  let aiAnalysis = null;

  try {
    aiAnalysis = await analyzeEngagementPatterns(claudeClient, repliesData, kolsData);
  } catch (error) {
    console.error(`⚠️  Claude analysis failed: ${error.message}`);
  }

  // Calculate overall metrics
  const overallMetrics = {
    totalKols: kolsData.kols.length,
    activeKols: kolsData.kols.filter(k => k.status === 'active').length,
    totalReplies: repliesData.replies.length,
    successRate: repliesData.replies.length > 0
      ? (repliesData.replies.filter(r => r.status === 'posted').length / repliesData.replies.length * 100).toFixed(1)
      : 0,
    averageEngagement: 0, // Would need to calculate from engagement data
    spamScore: spamIndicators.lowEngagementRate,
    lastCalculated: new Date().toISOString()
  };

  // Add to metrics data
  metricsData.weeklyReports.push(weeklyReport);
  metricsData.overallMetrics = overallMetrics;

  if (aiAnalysis) {
    metricsData.aiAnalysis = {
      ...aiAnalysis,
      analyzedAt: new Date().toISOString()
    };
  }

  // Save metrics
  saveMetricsData(metricsData);

  // Print report
  console.log(`
${'='.repeat(60)}
📊 WEEKLY ENGAGEMENT REPORT
${'='.repeat(60)}

Period: ${weekStart} to ${weekEnd}

PERFORMANCE
-----------
Total Replies: ${weekReplies.length}
Successful: ${successfulReplies.length}
Failed: ${failedReplies.length}
Success Rate: ${successRate}%
Avg Relevance Score: ${avgRelevanceScore}/100

PRODUCT PERFORMANCE
-------------------`);

  Object.entries(productEngagement).forEach(([product, data]) => {
    console.log(`${product}:
   Mentions: ${data.mentions}
   Avg Engagement: ${data.avgEngagement}
   Top KOL: @${data.topKol || 'N/A'}`);
  });

  console.log(`
TOP ENGAGING KOLS
-----------------`);

  topEngagingKols.slice(0, 5).forEach((kol, i) => {
    console.log(`${i + 1}. @${kol.username}
   Replies: ${kol.replies}
   Avg Engagement: ${kol.avgEngagement}
   Topics: ${kol.topics.join(', ') || 'N/A'}`);
  });

  console.log(`
SPAM INDICATORS
---------------
Failed Reply Rate: ${spamIndicators.lowEngagementRate.toFixed(1)}%
Risk Level: ${spamIndicators.lowEngagementRate > 20 ? '🔴 HIGH' : spamIndicators.lowEngagementRate > 10 ? '🟡 MEDIUM' : '🟢 LOW'}
`);

  if (aiAnalysis) {
    console.log(`
AI ANALYSIS
-----------
Overall Assessment: ${aiAnalysis.overallAssessment}

Strengths:
${aiAnalysis.strengths.map(s => `✓ ${s}`).join('\n')}

Weaknesses:
${aiAnalysis.weaknesses.map(w => `✗ ${w}`).join('\n')}

Recommendations:
${aiAnalysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Best Performing Product: ${aiAnalysis.bestPerformingProduct}
Spam Risk Level: ${aiAnalysis.spamRiskLevel.toUpperCase()}

Suggested Adjustments:
- Reply Frequency: ${aiAnalysis.suggestedAdjustments?.replyFrequency}
- Targeting: ${aiAnalysis.suggestedAdjustments?.targetingStrategy}
- Content: ${aiAnalysis.suggestedAdjustments?.contentApproach}
`);
  }

  console.log(`
OVERALL METRICS (All Time)
--------------------------
Total KOLs: ${formatNumber(overallMetrics.totalKols)}
Active KOLs: ${formatNumber(overallMetrics.activeKols)}
Total Replies: ${formatNumber(overallMetrics.totalReplies)}
Overall Success Rate: ${overallMetrics.successRate}%

${'='.repeat(60)}
`);

  console.log('✅ Analysis complete!');
}

// Run the script
analyzeEngagement().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
