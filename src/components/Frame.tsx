/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import sdk, {
  type Context,
} from "@farcaster/frame-sdk";
import { useAccount } from "wagmi";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { PROJECT_TITLE } from "~/lib/constants";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function Frame(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  
  // Quiz questions based on onsenbot's recent casts
  const quizData: QuizQuestion[] = [
    {
      question: "What is onsenbot's ticker symbol?",
      options: ["$ONSEN", "$DEGEN", "$WETH", "$TN100x"],
      correctAnswer: 0
    },
    {
      question: "What does onsenbot suggest fighting together with friends?",
      options: ["Bots", "Liquidity", "Dumps", "All of the above"],
      correctAnswer: 3
    },
    {
      question: "What token is mentioned alongside DEGEN and TN100x?",
      options: ["WETH", "ONSEN", "USDC", "BTC"],
      correctAnswer: 1
    },
    {
      question: "What was onsenbot doing after v2.alpha release?",
      options: ["Coding", "Relaxing", "Tweeting", "Launching pools"],
      correctAnswer: 1
    }
  ];

  const { address } = useAccount();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);

      console.log("Calling ready");
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);


  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  const handleAnswer = (selectedOption: number) => {
    if (selectedOption === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
      className="bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 min-h-screen"
    >
      <div className="w-[300px] mx-auto py-8 px-2">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              {title}
            </CardTitle>
          </CardHeader>
          
          {showScore ? (
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
              Quiz Complete!
            </h2>
            <p className="mb-4 text-neutral-700">You scored {score} out of {quizData.length}</p>
            <PurpleButton onClick={restartQuiz} className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 hover:from-purple-700 hover:via-blue-600 hover:to-pink-600">
              Restart Quiz
            </PurpleButton>
          </CardContent>
        ) : (
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Question {currentQuestion + 1}/{quizData.length}
            </h2>
            <p className="mb-4 text-neutral-700">{quizData[currentQuestion].question}</p>
            <div className="space-y-2">
              {quizData[currentQuestion].options.map((option, index) => (
                <PurpleButton
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full"
                >
                  {option}
                </PurpleButton>
              ))}
            </div>
          </CardContent>
        </Card>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
