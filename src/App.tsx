import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Container = styled.div<{ isDark: boolean }>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  padding: 20px;
  overflow: hidden;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isDark
      ? 'radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%)'
      : 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'};
    pointer-events: none;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const Card = styled(motion.div)<{ isDark: boolean }>`
  background: ${props => props.isDark 
    ? 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'
    : 'white'};
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: ${props => props.isDark
    ? '0 10px 30px rgba(0, 0, 0, 0.3), 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 120px rgba(56, 189, 248, 0.1)'
    : '0 10px 30px rgba(0, 0, 0, 0.1), 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 120px rgba(102, 126, 234, 0.2)'};
  max-width: 600px;
  width: 90%;
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${props => props.isDark
      ? 'linear-gradient(90deg, #38bdf8, #818cf8)'
      : 'linear-gradient(90deg, #ff6b6b, #4ecdc4)'};
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    box-shadow: ${props => props.isDark
      ? '0 15px 40px rgba(0, 0, 0, 0.4), 0 25px 70px rgba(0, 0, 0, 0.4), 0 0 150px rgba(56, 189, 248, 0.2)'
      : '0 15px 40px rgba(0, 0, 0, 0.15), 0 25px 70px rgba(0, 0, 0, 0.15), 0 0 150px rgba(102, 126, 234, 0.3)'};
    transform: translateY(-5px);
  }
`;

const Title = styled(motion.h1)<{ isDark: boolean }>`
  color: ${props => props.isDark ? '#ffffff' : '#2d3748'};
  margin-bottom: 2rem;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: color 0.3s ease;
`;

const Subtitle = styled(motion.p)<{ isDark: boolean }>`
  color: ${props => props.isDark ? '#a0aec0' : '#718096'};
  font-size: 1.2rem;
  margin-top: -1.5rem;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
`;

const JokeText = styled(motion.p)<{ isDark: boolean }>`
  color: ${props => props.isDark ? '#e2e8f0' : '#4a5568'};
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  white-space: pre-line;
  transition: color 0.3s ease;
`;

const Button = styled(motion.button)<{ isDark: boolean }>`
  background: ${props => props.isDark
    ? 'linear-gradient(90deg, #38bdf8, #818cf8)'
    : 'linear-gradient(90deg, #ff6b6b, #4ecdc4)'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  box-shadow: ${props => props.isDark
    ? '0 4px 15px rgba(56, 189, 248, 0.3)'
    : '0 4px 15px rgba(0, 0, 0, 0.1)'};
  margin: 0.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.isDark
      ? '0 6px 20px rgba(56, 189, 248, 0.4)'
      : '0 6px 20px rgba(0, 0, 0, 0.15)'};
    
    &::before {
      transform: translateX(100%);
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingText = styled(motion.p)<{ isDark: boolean }>`
  color: ${props => props.isDark ? '#a0aec0' : '#4a5568'};
  font-size: 1.2rem;
  transition: color 0.3s ease;
`;

const FloatingEmoji = styled(motion.div)`
  position: absolute;
  font-size: 2rem;
  pointer-events: none;
  z-index: 1;
`;

const BackgroundEmoji = styled(motion.div)`
  position: absolute;
  font-size: 1.5rem;
  pointer-events: none;
  z-index: 0;
  opacity: 0.1;
  filter: blur(1px);
`;

interface CategoryContainerProps {
  isDark: boolean;
}

const CategoryContainer = styled(motion.div)<CategoryContainerProps>`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
  padding: 0.5rem;
  background: ${props => props.isDark 
    ? 'rgba(30, 41, 59, 0.5)'
    : 'rgba(247, 250, 252, 0.5)'};
  border-radius: 15px;
  backdrop-filter: blur(5px);
`;

const CategoryButton = styled(motion.button)<{ isActive: boolean; isDark: boolean; isThala?: boolean }>`
  background: ${props => {
    if (props.isThala && props.isActive) {
      return 'linear-gradient(90deg, #FFFF00, #FFD700)';
    }
    return props.isActive 
      ? props.isDark
        ? 'linear-gradient(90deg, #38bdf8, #818cf8)'
        : 'linear-gradient(90deg, #ff6b6b, #4ecdc4)'
      : props.isDark ? '#1e293b' : '#f7fafc';
  }};
  color: ${props => {
    if (props.isThala && props.isActive) {
      return '#000000';
    }
    return props.isActive 
      ? 'white'
      : props.isDark ? '#e2e8f0' : '#4a5568';
  }};
  border: 2px solid ${props => {
    if (props.isThala) {
      return props.isActive ? '#FFFF00' : '#FFD700';
    }
    return props.isActive 
      ? 'transparent'
      : props.isDark ? '#334155' : '#e2e8f0';
  }};
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  position: relative;
  overflow: hidden;
  margin: 0.25rem;
  box-shadow: ${props => props.isThala && props.isActive 
    ? '0 0 15px rgba(255, 215, 0, 0.5)'
    : 'none'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => {
      if (props.isThala) {
        return '0 4px 12px rgba(255, 215, 0, 0.3)';
      }
      return props.isDark
        ? '0 4px 12px rgba(56, 189, 248, 0.3)'
        : '0 4px 12px rgba(0, 0, 0, 0.1)';
    }};
    
    &::before {
      transform: translateX(100%);
    }
  }
`;

const ShareButton = styled(Button)`
  background: ${props => props.isDark
    ? 'linear-gradient(90deg, #818cf8, #38bdf8)'
    : 'linear-gradient(90deg, #4ecdc4, #45b7af)'};
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '📱';
    font-size: 1.2rem;
  }
`;

const ShareOptions = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ShareOptionButton = styled(motion.button)<{ isDark: boolean }>`
  background: ${props => props.isDark ? '#2d3748' : '#f7fafc'};
  color: ${props => props.isDark ? '#e2e8f0' : '#4a5568'};
  border: 2px solid ${props => props.isDark ? '#4a5568' : '#e2e8f0'};
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.isDark
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const JokeCounter = styled(motion.div)<{ isDark: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.isDark ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${props => props.isDark ? '#e2e8f0' : '#4a5568'};
  box-shadow: ${props => props.isDark
    ? '0 2px 10px rgba(0, 0, 0, 0.3)'
    : '0 2px 10px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
`;

const ThemeToggle = styled(motion.button)<{ isDark: boolean }>`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${props => props.isDark 
    ? 'linear-gradient(145deg, #1e293b, #0f172a)'
    : 'rgba(255, 255, 255, 0.9)'};
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: ${props => props.isDark
    ? '0 2px 10px rgba(56, 189, 248, 0.2)'
    : '0 2px 10px rgba(0, 0, 0, 0.1)'};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: rotate(180deg) scale(1.1);
  }
`;

const JokeRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const RatingButton = styled(motion.button)<{ isDark: boolean; isActive: boolean }>`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: ${props => props.isDark ? (props.isActive ? '#ff6b6b' : '#e2e8f0') : (props.isActive ? '#ff6b6b' : '#4a5568')};

  &:hover {
    transform: scale(1.2);
  }
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const HelicopterAnimation = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
`;

const JOKES = {
  general: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "What do you call a fake noodle? An impasta!",
    "How does a penguin build its house? Igloos it together!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a can opener that doesn't work? A can't opener!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the math book look so sad? Because it had too many problems!",
    "What do you call a fish with no eyes? Fsh!"
  ],
  programming: [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why did the developer go broke? Because he used up all his cache!",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
    "Why do Java developers wear glasses? Because they can't C#!",
    "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings!",
    "Why did the programmer quit their job? Because they didn't get arrays!",
    "What do you call a computer that sings? A Dell!",
    "Why did the developer get kicked out of the restaurant? Because he kept using the table as a database!",
    "How do you know if a developer is extroverted? They look at your shoes when talking to you!",
    "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!"
  ],
  dad: [
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a fake noodle? An impasta!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "How does a penguin build its house? Igloos it together!",
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a can opener that doesn't work? A can't opener!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the math book look so sad? Because it had too many problems!",
    "What do you call a fish with no eyes? Fsh!"
  ],
  dank: [
    "Why did the skeleton go to the party alone? Because he had no body to go with!",
    "What do you call a bear with no teeth and no fur? A gummy bear!",
    "Why did the cookie go to the doctor? Because it was feeling crumbly!",
    "What do you call a fake noodle in space? An impasta-la!",
    "Why did the tomato turn red? Because it saw the salad dressing!",
    "What do you call a can opener that doesn't work in space? A can't-opener-naut!",
    "Why did the bicycle fall over in space? Because it was two-tired of floating!",
    "What do you call a bear with no teeth, no fur, and no eyes? A gummy bear that can't see!",
    "Why did the math book look so sad in space? Because it had too many problems with gravity!",
    "What do you call a fish with no eyes in space? A fsh-tronaut!"
  ],
  thala: [
    "My crush replied after 7 years. Thala for a reason, patience level: Dhoni!",
    "I failed 7 subjects in one semester. Thala for a reason, even my marks are loyal!",
    "My mom called me 7 times to eat veggies. Thala for a reason, still skipped!",
    "I kept 7 alarms, still woke up at 11. Thala for a reason, sleep OP!",
    "I have 7 exes. Thala for a reason, heartbreak pro max!",
    "I sent 7 \"Hi\"s, got 0 replies. Thala for a reason, ghosted legend!",
    "My WiFi disconnects every 7 minutes. Thala for a reason, buffering king!",
    "I ate 7 packets of Maggi in one night. Thala for a reason, noodle god!",
    "I got 7% in maths. Thala for a reason, calculator uninstall confirmed!",
    "I've been single for 7 years. Thala for a reason, relationship ban!",
    "My phone battery drops 7% every minute. Thala for a reason, charger ka baap!",
    "I saw 7 missed calls from dad. Thala for a reason, slipper incoming!",
    "I have 7 pending assignments. Thala for a reason, deadline dodger!",
    "I watched 7 seasons of a show in 2 days. Thala for a reason, binge beast!",
    "I got 7 likes on my meme. Thala for a reason, influencer in progress!",
    "I've been friendzoned 7 times. Thala for a reason, bro-zone CEO!",
    "I lost 7 pens in one exam. Thala for a reason, magician level: unlocked!",
    "I have 7 unread WhatsApp groups. Thala for a reason, mute master!",
    "I sneezed 7 times in a row. Thala for a reason, allergy OP!",
    "I got 7 \"Are you coming?\" texts, still didn't go. Thala for a reason, introvert gang!",
    "I've changed 7 career plans this year. Thala for a reason, confusion pro!",
    "I have 7 tabs open, all memes. Thala for a reason, productivity 0!",
    "I got 7 delivery OTPs, still hungry. Thala for a reason, Zomato ka dost!",
    "I've been blocked by 7 people. Thala for a reason, savage mode ON!",
    "I've rewatched Dhoni's 2011 six 7 times today. Thala for a reason, nostalgia max!",
    "I have 7 memes saved for every mood. Thala for a reason, meme library!",
    "I've been typing \"Thala for a reason\" for 7 minutes. Thala for a reason, meta joke!",
    "I have 7 empty water bottles on my desk. Thala for a reason, hydration gone!",
    "I've scrolled 7 hours on reels. Thala for a reason, thumb workout!",
    "I've been rejected 7 times in a row. Thala for a reason, comeback stronger!",
    "Ordered 7 idlis, waiter said \"Thala for a reason.\"",
    "Battery at 7%, phone said \"Respect Thala.\"",
    "Slept at 7 PM, woke up as a Thala.",
    "Got 7 likes on my meme, even God said \"Thala approved.\"",
    "Watched Fast & Furious 7, Vin Diesel whispered \"Thala for a reason.\"",
    "My crush replied in 7 words, I proposed immediately.",
    "Missed 7 calls from mom—feeling like MS Doom.",
    "Room no. 7 in hotel? Destiny.",
    "Asked for 7 fries, they gave me a Thala burger.",
    "7 steps into gym, I felt like Dhoni.",
    "Page 7 of my book had no words—just \"Thala.\"",
    "Blinked 7 times and missed the lecture—Thala for a reason.",
    "Failed 7 subjects but topped in \"Thalanomics.\"",
    "Met 7 dogs on my way—felt blessed by Thala.",
    "Stood in 7th row in concert, singer nodded: \"Thala fan spotted.\"",
    "Got 7 Rs cashback—UPI said \"Thala entered.\"",
    "Birthday on 7th? You're not born, you're summoned.",
    "My crush rejected me 7 times—true Thala pain.",
    "Woke up at 7:07—divine signal.",
    "7th episode of anime hit different—Thala arc unlocked.",
    "Found 7 rupees on road—MSD coin toss vibes.",
    "Typo on roll no. made it 7—prof said \"Thala entry.\"",
    "Tried 7 times to diet—ended in biryani.",
    "Got 7th rank—friends said \"You're not topper, you're Thala.\"",
    "7 seconds into the reel, already felt inspired.",
    "Pressed button 7 times—lift opened with Dhoni inside (in dreams).",
    "My name has 7 letters—parents knew I'd be Thala.",
    "Sent \"Hi\" 7 times—she replied \"Thala vibes.\"",
    "7 backlogs but walked out like a captain.",
    "Threw 7 paper balls in class—teacher gave me captaincy.",
    "My WiFi password is 000007. Thala for a reason.",
    "Ordered 7 biryanis, got extra raita. Thala for a reason.",
    "My phone battery died at 7%. Even technology knows. Thala for a reason.",
    "Got 7 likes on my meme. Algorithm respects the Thala. Thala for a reason.",
    "CSK scored 77 runs in 7 overs. Coincidence? Dhoni coding the script. Thala for a reason.",
    "Teacher asked for 7 reasons to study. I wrote \"Dhoni\" 7 times. Full marks. Thala for a reason.",
    "My Uber fare: ₹77. Driver said, \"Sir, you must be a CSK fan.\" Thala for a reason.",
    "IPL auction: Player sold for 7 crores. Dhoni: \"He's ready.\" Thala for a reason.",
    "7 missed calls from mom. Even she's on brand. Thala for a reason.",
    "My pizza had 7 slices. Dhoni cut it himself. Thala for a reason.",
    "Woke up at 7:07 AM. Dreamt of helicopter shots. Thala for a reason.",
    "My crush replied after 7 days. Loyalty test passed. Thala for a reason.",
    "Watched 7 episodes of a show, still waiting for Dhoni cameo. Thala for a reason.",
    "My OTP: 700007. Even banks know the vibe. Thala for a reason.",
    "7 tabs open, all CSK highlights. Productivity = Thala. Thala for a reason.",
    "My friend's wedding on 7/7. Invited Dhoni as chief guest. Thala for a reason.",
    "7 wickets fell, Dhoni still not worried. Universe aligns. Thala for a reason.",
    "My exam hall seat: Row 7, Seat 7. Destiny is a CSK fan. Thala for a reason.",
    "7 notifications, all \"Thala trending.\" Twitter knows the drill. Thala for a reason.",
    "My dog barked 7 times when Dhoni came on screen. Even pets stan Thala. Thala for a reason.",
    "7th over, 7th ball, 7 runs. Wait, there's no 7th ball? Dhoni creates his own rules. Thala for a reason.",
    "My screen cracked at 7:00 PM. Dhoni's aura too strong. Thala for a reason.",
    "7 memes in drafts, all about Thala. Meme gods approve. Thala for a reason.",
    "Google search history: \"Why 7 is lucky for Dhoni?\" Thala for a reason.",
    "7th question in quiz: \"Who is Thala?\" If you know, you know. Thala for a reason.",
    "7th page of my notebook: Only helicopter doodles. Thala for a reason.",
    "7 seconds left, Dhoni finishes the match. Scripted by destiny. Thala for a reason.",
    "My crush's birthday: 7th July. Manifesting Dhoni-level luck. Thala for a reason.",
    "7 emojis in my status, all lions. CSK fever. Thala for a reason.",
    "Even my calculator shows 7 when I type \"THALA.\" Illuminati confirmed. Thala for a reason."
  ],
  dark:[
    "Religion is like penis! its fine to have one,its fine not to have one.the problem starts when showing it down children's throats",
    "killing black people is a lot like saying the N-word.They do it all the time,but get REAL mad when  a white person does it",
    "i like my COVID like my women,19 and easily spread",
    "what's difference between a black man and a black hole? the black hole is a lot more dense",
    "what's the difference between Taliban fighter and an Iraq child? How the fuck should i know? I'm a drone pilot",
    "What happend to my virginity when my uncle walked in the room? [removed]", 
    "You could really tell the US government was tired of No Shave November.As soon as December 1st hits,Bush was gone.",
    "I onced had sex with a girl who has a stutter.Thank God i was able to finish before she was able to say \"No\" ",
    "What's the best thing about killing a hooker? Not only you get your money back ,but the second hour is free",
    "I asked my friend i she wants to play a rape game.She: \"No\" Me: \"Thats the spirit\"",
    "If i had a dollar for evry racist thing i've ever said.... Some black motherfucker would probably rob me.",
    "I already failed No Nut November.  It was lot more easier two years ago when i didn't have sister",
   "I asked my girlfriend if we could try out a rape fantasy.She said no.It was best night of my life.",
   "Sex is like broccoli.If you were forced to have it as a kid then you probably won't like it as an adult.",
   "Q:What does not belong? Eggs,wife or blowjob. A:Blowjob. you can beat your eggs and you can beat your wife,but you can't beat blowjob.",
   "I donated some money to an LGBT charity the other day.  I really hope they can raise enough money to find cure.",
   "getting a handjob is just like watching paralympics. You appreciate the effort but you know you could do better.",
   "What pikachu and 6 million jews have in common? They're both ashes.",
   "I hate it when guys say their girlfriends are their \"Partners in crime \" Like we got it bro she's underage",
   "Why do chinese people like playing Among Us. its only place they can vote.",
   "What's difference between a cop and a bullet. When a bullet kills somebody you know its been fired."
  ]

};

function App() {
  const [joke, setJoke] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [jokeCount, setJokeCount] = useState<number>(0);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof JOKES>("general");
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
  const [backgroundEmojis, setBackgroundEmojis] = useState<Array<{ id: number; emoji: string; x: number; y: number; path: { x: number; y: number }[] }>>([]);
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => { 
    // Create initial background emojis with random paths
    const initialEmojis = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: getRandomEmoji(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      path: generateRandomPath()
    }));
    setBackgroundEmojis(initialEmojis);
  }, []);

  const generateRandomPath = () => {
    const points = [];
    const numPoints = 4 + Math.floor(Math.random() * 3); // 4-6 points
    
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    
    return points;
  };

  const getEmojiAnimation = (path: { x: number; y: number }[]) => {
    return {
      x: path.map(p => p.x),
      y: path.map(p => p.y),
      transition: {
        duration: 20 + Math.random() * 10,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear" as const
      }
    };
  };

  const addFloatingEmoji = () => {
    const newEmoji = {
      id: Date.now(),
      emoji: getRandomEmoji(),
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 2000);
  };

  const getRandomEmoji = () => {
    const emojis = ['😂', '🤣', '😆', '😄', '😅', '🤪', '😜', '🤓', '😎', '🤩'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const getHelicopterAnimation = () => {
    return {
      initial: { 
        opacity: 0,
        scale: 0,
        rotate: -45,
        x: '-100%',
        y: '100%'
      },
      animate: { 
        opacity: [0, 1, 1, 0],
        scale: [0, 1.5, 1.5, 0],
        rotate: [-45, 0, 360, 720],
        x: ['-100%', '0%', '100%', '200%'],
        y: ['100%', '0%', '-100%', '-200%']
      },
      transition: {
        duration: 2,
        times: [0, 0.2, 0.8, 1],
        ease: "easeInOut" as const
      }
    };
  };

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const jokeData = JOKES[selectedCategory][Math.floor(Math.random() * JOKES[selectedCategory].length)];
      setJoke(jokeData);
      addFloatingEmoji();
      setJokeCount(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching joke:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = (value: number) => {
    addFloatingEmoji();
    setRating(value);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const shareJoke = async () => {
    const shareText = `Check out this joke from GiggleGen:\n\n${joke}\n\nShared via GiggleGen`;
    const encodedText = encodeURIComponent(shareText);
    
    // Try to use Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GiggleGen Joke',
          text: shareText,
          url: window.location.href
        });
        return;
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }

    // Fallback to WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(joke);
      alert('Joke copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Container isDark={isDarkTheme}>
      <Card
        isDark={isDarkTheme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <ThemeToggle
          isDark={isDarkTheme}
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            rotate: isDarkTheme ? 180 : 0,
            scale: 1
          }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
        >
          {isDarkTheme ? '🌞' : '🌙'}
        </ThemeToggle>

        <Title isDark={isDarkTheme}>GiggleGen</Title>
        <Subtitle isDark={isDarkTheme}>Your Daily Dose of Laughter</Subtitle>

        <CategoryContainer isDark={isDarkTheme}>
          {(Object.keys(JOKES) as Array<keyof typeof JOKES>).map((category) => (
            <CategoryButton
              key={category}
              isActive={selectedCategory === category}
              isDark={isDarkTheme}
              isThala={category === 'thala'}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category === 'thala' ? '🦁 Thala' : category.charAt(0).toUpperCase() + category.slice(1)}
            </CategoryButton>
          ))}
        </CategoryContainer>

        <AnimatePresence>
          {joke && !loading && (
            <>
              <JokeText
                isDark={isDarkTheme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {joke}
              </JokeText>
              {selectedCategory === 'thala' && (
                <HelicopterAnimation
                  key="helicopter"
                  {...getHelicopterAnimation()}
                >
                  🚁
                </HelicopterAnimation>
              )}
            </>
          )}
        </AnimatePresence>

        <RatingContainer>
          <RatingButton
            isDark={isDarkTheme}
            isActive={rating === 1}
            onClick={() => handleRating(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            😴
          </RatingButton>
          <RatingButton
            isDark={isDarkTheme}
            isActive={rating === 2}
            onClick={() => handleRating(2)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            😊
          </RatingButton>
          <RatingButton
            isDark={isDarkTheme}
            isActive={rating === 3}
            onClick={() => handleRating(3)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            😂
          </RatingButton>
        </RatingContainer>

        <ButtonContainer>
          <Button
            isDark={isDarkTheme}
            onClick={fetchJoke}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Joke'}
          </Button>
          
          {joke && (
            <>
              <ShareButton
                isDark={isDarkTheme}
                onClick={shareJoke}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share on WhatsApp
              </ShareButton>
              <ShareOptions
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ShareOptionButton
                  isDark={isDarkTheme}
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📋 Copy
                </ShareOptionButton>
              </ShareOptions>
            </>
          )}
        </ButtonContainer>

        {floatingEmojis.map(emoji => (
          <FloatingEmoji
            key={emoji.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: emoji.x,
              y: emoji.y
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            {emoji.emoji}
          </FloatingEmoji>
        ))}

        {backgroundEmojis.map(emoji => (
          <BackgroundEmoji
            key={emoji.id}
            initial={{ 
              opacity: 0,
              x: emoji.path[0].x,
              y: emoji.path[0].y,
              rotate: 0
            }}
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              rotate: [0, 360],
              ...getEmojiAnimation(emoji.path)
            }}
            transition={{
              opacity: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse" as const
              },
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear" as const
              }
            }}
          >
            {emoji.emoji}
          </BackgroundEmoji>
        ))}
      </Card>
    </Container>
  );
}

export default App;
