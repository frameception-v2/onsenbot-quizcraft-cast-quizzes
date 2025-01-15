/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import sdk, {
  type Context,
} from "@farcaster/frame-sdk";
import { useAccount } from "wagmi";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { PROJECT_TITLE } from "~/lib/constants";

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
  
  // Sample quiz data - would be fetched from user's casts in real implementation
  const quizData: QuizQuestion[] = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: 0
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
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
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
        
        {showScore ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Quiz Complete!</h2>
            <p className="mb-4">You scored {score} out of {quizData.length}</p>
            <PurpleButton onClick={restartQuiz}>Restart Quiz</PurpleButton>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Question {currentQuestion + 1}/{quizData.length}
            </h2>
            <p className="mb-4">{quizData[currentQuestion].question}</p>
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
          </div>
        )}
      </div>
    </div>
  );
}
