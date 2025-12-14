// src/pages/Assessment.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const questions = [
  // ... same questions for assessment
  {
    question: 'How often have you felt nervous or anxious in the past 2 weeks?',
    category: 'anxiety',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    question: 'How often have you felt down, depressed, or hopeless?',
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    question: 'How would you rate your current stress level?',
    category: 'stress',
    options: ['Very low', 'Low', 'Moderate', 'High', 'Very high']
  },
  {
    question: 'How well have you been sleeping recently?',
    category: 'wellbeing',
    options: ['Very well', 'Well', 'Poorly', 'Very poorly']
  },
  {
    question: 'Do you feel overwhelmed by daily responsibilities?',
    category: 'stress',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    question: 'How satisfied are you with your relationships?',
    category: 'wellbeing',
    options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied']
  },
  {
    question: 'Have you lost interest in activities you usually enjoy?',
    category: 'depression',
    options: ['Not at all', 'A little', 'Somewhat', 'Very much']
  },
  {
    question: 'How often do you engage in self-care activities?',
    category: 'wellbeing',
    options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never']
  }
];

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [report, setReport] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnswer = (answerIndex) => {
    const newAnswers = {
      ...answers,
      [currentQuestion]: {
        question: questions[currentQuestion].question,
        answer: questions[currentQuestion].options[answerIndex],
        score: answerIndex,
        category: questions[currentQuestion].category,
        optionIndex: answerIndex
      }
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // convert and send to backend
      submitToBackend(newAnswers);
    }
  };

  // NEW: submit answers to your backend endpoint
const submitToBackend = async (finalAnswers) => {
  setIsProcessing(true);

  // safe environment detection (works for Vite, CRA, or fallback to same-origin)
  const API_BASE = (() => {
    try {
      if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }
    } catch (e) {
      
    }
    if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    // allow a runtime override via window
    if (typeof window !== "undefined" && window.__API_URL__) {
      return window.__API_URL__;
    }
    return "";
  })();

  
  const base = API_BASE ? API_BASE.replace(/\/$/, "") : "";
  const url = `${base}/api/mentalhealth/submit`;

  try {
    const payload = {
      answers: Object.entries(finalAnswers).map(([qIdx, ans]) => ({
        questionIndex: Number(qIdx),
        optionIndex: ans.optionIndex
      }))
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error("Backend error", res.status, errBody);
      toast.error("Failed to generate report — server error");
      setIsProcessing(false);
      return;
    }

    const data = await res.json();
    if (data && data.report) {
      setReport(data.report);
      setIsComplete(true);
      toast.success("Your mental health report is ready!");
    } else {
      console.error("Unexpected backend response", data);
      toast.error("Failed to generate report — invalid response");
    }
  } catch (err) {
    console.error("Network or server error", err);
    toast.error("Failed to generate report — network error");
  } finally {
    setIsProcessing(false);
  }
};


  // helper color utils (unchanged)
  const getStressLevelColor = (level) => {
    const colors = {
      low: 'from-green-500 to-green-600',
      moderate: 'from-yellow-500 to-yellow-600',
      high: 'from-orange-500 to-orange-600',
      severe: 'from-red-500 to-red-600'
    };
    return colors[level] || 'from-gray-500 to-gray-600';
  };

  const getScoreColor = (score) => {
    if (score < 3) return 'text-green-600';
    if (score < 5) return 'text-yellow-600';
    if (score < 7) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isProcessing) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-beige-50">
        <Card className="rounded-3xl p-12 text-center max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Responses</h2>
          <p className="text-gray-600">Generating your personalized wellness report...</p>
        </Card>
      </div>
    );
  }

  if (isComplete && report) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-beige-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Assessment Complete</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Wellness Report</h1>
            <p className="text-gray-600">Generated on {new Date(report.report_date).toLocaleDateString()}</p>
          </div>

          {/* Overall Status */}
          <Card className={`rounded-3xl border-4 bg-gradient-to-r ${getStressLevelColor(report.stress_level)} text-white mb-8 p-8`}>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Overall Stress Level: {report.stress_level.toUpperCase()}</h2>
              <p className="text-lg opacity-90">Based on your responses, here's what we found</p>
            </div>
          </Card>

          {/* Scores */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="rounded-3xl p-6 border-2">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Anxiety Level</h3>
                <span className={`text-3xl font-bold ${getScoreColor(report.anxiety_score)}`}>
                  {report.anxiety_score}/10
                </span>
              </div>
              <Progress value={report.anxiety_score * 10} className="h-3" />
            </Card>

            <Card className="rounded-3xl p-6 border-2">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Depression Score</h3>
                <span className={`text-3xl font-bold ${getScoreColor(report.depression_score)}`}>
                  {report.depression_score}/10
                </span>
              </div>
              <Progress value={report.depression_score * 10} className="h-3" />
            </Card>

            <Card className="rounded-3xl p-6 border-2">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Wellbeing Score</h3>
                <span className={`text-3xl font-bold ${getScoreColor(10 - report.wellbeing_score)}`}>
                  {report.wellbeing_score}/10
                </span>
              </div>
              <Progress value={report.wellbeing_score * 10} className="h-3" />
            </Card>

            <Card className="rounded-3xl p-6 border-2 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-700">What's Next?</h3>
              </div>
              <p className="text-sm text-gray-600">
                Follow the recommendations below and track your progress over time
              </p>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="rounded-3xl p-8 border-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertCircle className="h-7 w-7 text-purple-600" />
              Personalized Recommendations
            </h2>
            <div className="space-y-4">
              {report.recommendations.map((rec, index) => (
                <div key={index} className="flex gap-4 p-4 bg-purple-50 rounded-2xl">
                  <div className="h-8 w-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center mt-8">
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-6 text-lg rounded-2xl"
            >
              Take Another Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-beige-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <FileText className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Mental Wellness Assessment</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">How Are You Feeling?</h1>
          <p className="text-gray-600">Answer honestly to get personalized insights</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="rounded-3xl p-8 border-2 border-purple-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 leading-relaxed">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-6">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
                >
                  <span className="text-gray-700 group-hover:text-purple-700 font-medium">
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {currentQuestion > 0 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="rounded-2xl px-6"
            >
              Previous Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
