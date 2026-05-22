# FM-GPT Game Design Document

## Overview

FM-GPT is a detailed web-based football management simulation game inspired by Football Manager series. Phase 1 focuses on Turkish Super Lig with the top 10 teams.

## Core Systems

### 1. Squad Management

**Player Attributes:**
- Attacking: Pace, Shooting, Passing
- Defending: Defending, Physical
- Mental: Concentration, Positioning, Decision Making
- Technical: Dribbling, First Touch, Ball Control
- GK Specific: Handling, Distribution, Reflexes

**Player States:**
- Fitness (0-100%)
- Form (-5 to +5)
- Morale (-5 to +5)
- Injury status (Fit, Minor, Major, Out)
- Contract status (Active, Expiring, Retired)

**Squad Structure:**
- Max 11 starting players + substitutes
- Training assignments
- Contract management
- Development pathway

### 2. Tactical System

**Formations:**
- 4-4-2, 4-3-3, 3-5-2, 5-3-2, etc.

**Player Roles:**
- Positions: GK, LB, CB, RB, LM, CM, RM, ST, etc.
- Roles: Defender, Midfielder, Attacker, etc.
- Instructions: Aggressive, Normal, Defensive

**Set Pieces:**
- Corner kicks
- Free kicks
- Throw-ins
- Penalties

### 3. Transfer Market

**Transfer Types:**
- Permanent transfers
- Loan deals
- Free transfers

**Transfer Process:**
1. Player Search
2. Offer Placement
3. Negotiation
4. Contract Agreement
5. Medical & Completion

**Financial Aspects:**
- Transfer fees
- Agent fees
- Salary offers
- Squad budget

### 4. Match Simulation

**Key Events:**
- Goals (with descriptions)
- Injuries
- Substitutions
- Red/Yellow cards
- Possession changes

**Performance Metrics:**
- Possession %
- Shots on target
- Pass accuracy
- Player ratings

### 5. Financial System

**Revenue:**
- Match day revenue
- Commercial deals
- Broadcasting rights
- Merchandise

**Expenses:**
- Player wages
- Training facility costs
- Medical staff
- Transportation

### 6. Season Structure

**Competitions:**
- League (34 matches)
- Turkish Cup
- European cups (Europa League)

**Calendar:**
- Matchday scheduling
- International breaks
- Winter break
- Off-season

## User Interface

### Main Screens

1. **Dashboard**: Overview of team status, next matches, key alerts
2. **Team Screen**: Squad overview, formation builder
3. **Player Detail**: Individual player stats, contract, development
4. **Transfer Market**: Search, offers, negotiations
5. **Matches**: Schedule, results, match details
6. **Finance**: Budget, wages, revenue
7. **Tactics**: Formation, instructions, set pieces
8. **League Table**: Standings, statistics

## Game Progression

**Short-term (1-2 seasons):**
- Squad optimization
- Tactical development
- Competing for league title

**Long-term (5+ seasons):**
- Youth development
- Building a legacy
- Sustained success

## Technical Specifications

### Database Schema

**Teams Table:**
- id, name, city, stadium, capacity, budget, coach

**Players Table:**
- id, team_id, name, age, nationality, position, attributes, contract_end

**Matches Table:**
- id, date, home_team, away_team, home_goals, away_goals, status

**Contracts Table:**
- id, player_id, team_id, salary, start_date, end_date

**Transfers Table:**
- id, player_id, from_team, to_team, fee, date, type

## Future Phases

**Phase 2:**
- Additional leagues (Europe)
- Youth academy system
- More detailed player development

**Phase 3:**
- AI opponents with personality
- Multiplayer support
- Advanced analytics

**Phase 4:**
- Mobile app
- Real-time match viewing
- Community features
