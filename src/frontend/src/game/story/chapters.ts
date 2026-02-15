export interface Choice {
  id: string;
  text: string;
  effects: Record<string, number>;
}

export interface Chapter {
  id: number;
  title: string;
  background: string;
  narratives: string[];
  choices: Choice[];
  challengeType: 'focus' | 'tactics' | 'wisdom' | 'brawl';
}

export const chapters: Chapter[] = [
  {
    id: 0,
    title: "First Blood",
    background: '/assets/generated/streetfight-alley-bg.dim_1920x1080.png',
    narratives: [
      "The back alley reeks of garbage and broken dreams. You've been pushed around your whole life—by gangs, by the system, by everyone who thought you were nothing.",
      "Tonight, that changes. A local crew has been shaking down your neighborhood for weeks. They think they own these streets. They think no one will stand up to them.",
      "Three of them block your path, smirking. The leader cracks his knuckles. 'Wrong place, wrong time,' he says. But you're done running. Your fists clench. This is where you make your stand.",
    ],
    choices: [
      {
        id: 'stand_ground',
        text: 'Stand your ground and face them head-on',
        effects: { virtue: 10, courage: 10 },
      },
      {
        id: 'tactical_retreat',
        text: 'Draw them into a narrow space where numbers don\'t matter',
        effects: { wisdom: 10, courage: 5 },
      },
    ],
    challengeType: 'brawl',
  },
  {
    id: 1,
    title: 'Underground Reputation',
    background: '/assets/generated/streetfight-warehouse-bg.dim_1920x1080.png',
    narratives: [
      'Word spreads fast on the streets. You took down three guys in that alley, and now people are talking. Some with respect, others with fear. A few with anger.',
      'An underground fight club operates out of an abandoned warehouse on the docks. They\'ve heard about you. The organizer, a scarred veteran named Razor, offers you a spot in the next tournament.',
      'This isn\'t just about money or glory. Win here, and you earn real respect. Lose, and you might not walk out. The crowd roars as you step into the makeshift ring under flickering industrial lights.',
    ],
    choices: [
      {
        id: 'aggressive_style',
        text: 'Fight aggressively—overwhelm them with raw power',
        effects: { courage: 15, virtue: -5 },
      },
      {
        id: 'defensive_counter',
        text: 'Stay defensive and counter their mistakes',
        effects: { wisdom: 15, virtue: 5 },
      },
    ],
    challengeType: 'focus',
  },
  {
    id: 2,
    title: "King of the Streets",
    background: '/assets/generated/streetfight-rooftop-bg.dim_1920x1080.png',
    narratives: [
      "You've climbed the ranks. Every fighter in the city knows your name now. But there's one more challenge—the current champion, a brutal enforcer known only as 'The Hammer.'",
      "He's undefeated. Thirty-two fights, thirty-two knockouts. He doesn't just beat opponents; he breaks them. The final match is set on a rooftop overlooking the city—neutral ground, no rules, no mercy.",
      "As the sun sets and the city lights flicker on below, you face him. This is it. Everything you've fought for comes down to this moment. Win, and you become a legend. Lose, and you're just another name forgotten in the gutter.",
    ],
    choices: [
      {
        id: 'respect_challenge',
        text: 'Offer a respectful challenge—fighter to fighter',
        effects: { wisdom: 10, virtue: 15 },
      },
      {
        id: 'no_mercy',
        text: 'Show no mercy—this is survival of the strongest',
        effects: { courage: 20, virtue: -5 },
      },
    ],
    challengeType: 'tactics',
  },
];
