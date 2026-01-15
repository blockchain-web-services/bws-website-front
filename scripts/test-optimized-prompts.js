/**
 * Test script for optimized Anthropic API prompts
 * Tests evaluateTweetForReply and generateReplyText functions
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const worktreeRoot = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(worktreeRoot, '.env') });

import {
  createClaudeClient,
  evaluateTweetForReply,
  generateReplyText
} from './crawling/utils/claude-client.js';

import { loadBWSProducts } from './crawling/utils/kol-utils.js';

// Mock tweet data
const mockTweet = {
  id: 'test123',
  text: 'Looking for solid microcap gems with real utility for 2026. Too many projects with no fundamentals. What are you accumulating?',
  created_at: '2026-01-07T16:00:00.000Z',
  author: {
    username: 'CryptoInvestor',
    id: 'user123'
  },
  public_metrics: {
    likes: 245,
    retweets: 42,
    replies: 18
  }
};

const mockKOLProfile = {
  username: 'CryptoInvestor',
  followersCount: 12500,
  recentTopics: ['altcoins', 'DeFi', 'gems']
};

const mockConfig = {
  spamPrevention: {
    avoidKeywords: ['scam', 'rugpull', 'guaranteed'],
    avoidCompetitors: ['OtherProject', 'CompetitorCoin']
  }
};

async function testOptimizedPrompts() {
  console.log('🧪 Testing Optimized Anthropic API Prompts\n');
  console.log('='.repeat(60));

  try {
    // Load Claude client
    const claudeClient = createClaudeClient();
    console.log('✅ Claude client initialized\n');

    // Load BWS products
    const products = loadBWSProducts();
    console.log(`✅ Loaded ${Object.keys(products).length} BWS products\n`);

    // Test 1: Evaluate Tweet (optimized with pre-filtering)
    console.log('📊 Test 1: Evaluating tweet with optimized prompt...');
    const startEval = Date.now();

    const evaluation = await evaluateTweetForReply(
      claudeClient,
      mockTweet,
      mockKOLProfile,
      products,
      mockConfig
    );

    const evalTime = Date.now() - startEval;
    console.log(`   ⏱️  Evaluation completed in ${evalTime}ms`);
    console.log(`   Should Reply: ${evaluation.shouldReply ? '✅' : '❌'}`);
    console.log(`   Relevance Score: ${evaluation.relevanceScore}%`);
    console.log(`   Best Product: ${evaluation.bestMatchingProduct || 'Platform-level'}`);
    console.log(`   Category: ${evaluation.tweetCategory}`);
    console.log(`   Reasoning: ${evaluation.reasoning}\n`);

    if (evaluation.shouldReply) {
      // Test 2: Generate Reply (optimized with reduced context)
      console.log('✍️  Test 2: Generating reply with optimized prompt...');
      const startReply = Date.now();

      // Mock recent replies for diversity testing
      const mockRecentReplies = [
        {
          timestamp: '2026-01-06T12:00:00.000Z',
          productMentioned: 'X Bot',
          replyText: 'Great point about finding quality projects.\n\n$BWS operates a Blockchain Solutions Marketplace with multiple products targeting mass markets.\n\n@BWSCommunity #altcoins #gems https://www.bws.ninja'
        },
        {
          timestamp: '2026-01-05T14:00:00.000Z',
          productMentioned: 'Platform',
          replyText: 'Totally agree on fundamentals.\n\n$BWS keeps shipping: credentials, ESG reporting, NFT APIs. Real utility across multiple sectors.\n\n@BWSCommunity #blockchain #Web3 https://www.bws.ninja'
        }
      ];

      // Handle comma-separated product names - take first one
      let productName = evaluation.bestMatchingProduct;
      if (productName && productName.includes(',')) {
        productName = productName.split(',')[0].trim();
      }

      const product = productName && products[productName]
        ? products[productName]
        : products['BWS Marketplace']; // Default to platform

      const reply = await generateReplyText(
        claudeClient,
        mockTweet,
        mockKOLProfile,
        product,
        evaluation,
        'microcap opportunity with real fundamentals',
        mockRecentReplies
      );

      const replyTime = Date.now() - startReply;
      console.log(`   ⏱️  Reply generated in ${replyTime}ms`);
      console.log(`   Reply length: ${reply.replyText.length} characters`);
      console.log(`   Tone: ${reply.tone}`);
      console.log(`   Primary Hook: ${reply.primaryHook}\n`);
      console.log('   Generated Reply:');
      console.log('   ' + '-'.repeat(58));
      console.log('   ' + reply.replyText.split('\n').join('\n   '));
      console.log('   ' + '-'.repeat(58) + '\n');

      // Performance summary
      console.log('='.repeat(60));
      console.log('📈 Performance Summary:');
      console.log(`   Evaluation: ${evalTime}ms`);
      console.log(`   Reply Generation: ${replyTime}ms`);
      console.log(`   Total: ${evalTime + replyTime}ms`);
      console.log(`   Reply Length: ${reply.replyText.length}/280 chars (${reply.replyText.length <= 280 ? '✅ PASS' : '❌ FAIL'})`);

    } else {
      console.log('⏭️  Skipping reply generation (tweet not suitable for reply)\n');
    }

    console.log('='.repeat(60));
    console.log('✅ All tests completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
testOptimizedPrompts();
