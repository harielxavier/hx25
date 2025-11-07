import React, { useState } from 'react';
import './WeddingStyleQuiz.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    image: string;
    style: string;
  }[];
}

interface StyleResult {
  style: string;
  title: string;
  description: string;
  sampleImages: string[];
  recommendations: string[];
}

const WeddingStyleQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "Which of these wedding venues appeals to you most?",
      options: [
        {
          text: "A grand, elegant ballroom with chandeliers",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/venue-ballroom.jpg",
          style: "classic"
        },
        {
          text: "A rustic barn with string lights and wooden details",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/venue-barn.jpg",
          style: "rustic"
        },
        {
          text: "A modern art gallery or industrial space",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/venue-modern.jpg",
          style: "editorial"
        },
        {
          text: "An outdoor garden or beach ceremony",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/venue-outdoor.jpg",
          style: "natural"
        }
      ]
    },
    {
      id: 2,
      question: "How would you like to look in your wedding photos?",
      options: [
        {
          text: "Timeless and elegant, with traditional poses",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/look-classic.jpg",
          style: "classic"
        },
        {
          text: "Relaxed and authentic, capturing genuine moments",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/look-natural.jpg",
          style: "natural"
        },
        {
          text: "Bold and dramatic, like a magazine editorial",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/look-editorial.jpg",
          style: "editorial"
        },
        {
          text: "Warm and intimate, with a vintage feel",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/look-rustic.jpg",
          style: "rustic"
        }
      ]
    },
    {
      id: 3,
      question: "Which color palette do you prefer for your wedding?",
      options: [
        {
          text: "Neutral and earthy tones (greens, browns, creams)",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/colors-earthy.jpg",
          style: "rustic"
        },
        {
          text: "Bold, contrasting colors with dramatic lighting",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/colors-bold.jpg",
          style: "editorial"
        },
        {
          text: "Classic whites, ivories, and metallics",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/colors-classic.jpg",
          style: "classic"
        },
        {
          text: "Soft, pastel colors with natural light",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/colors-soft.jpg",
          style: "natural"
        }
      ]
    },
    {
      id: 4,
      question: "What's most important to you in your wedding photos?",
      options: [
        {
          text: "Capturing authentic emotions and candid moments",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/priority-candid.jpg",
          style: "natural"
        },
        {
          text: "Beautiful, perfectly composed portraits",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/priority-portraits.jpg",
          style: "classic"
        },
        {
          text: "Creative, unique shots that stand out",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/priority-creative.jpg",
          style: "editorial"
        },
        {
          text: "Telling a story with warmth and character",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/priority-story.jpg",
          style: "rustic"
        }
      ]
    },
    {
      id: 5,
      question: "Which of these wedding details resonates with you?",
      options: [
        {
          text: "Handcrafted elements and personal touches",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/details-handcrafted.jpg",
          style: "rustic"
        },
        {
          text: "Luxurious florals and elegant table settings",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/details-luxury.jpg",
          style: "classic"
        },
        {
          text: "Minimalist, architectural details",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/details-minimalist.jpg",
          style: "editorial"
        },
        {
          text: "Organic, garden-inspired elements",
          image: "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_400/v1/quiz/details-organic.jpg",
          style: "natural"
        }
      ]
    }
  ];

  const styleResults: Record<string, StyleResult> = {
    classic: {
      style: "Classic Elegance",
      title: "Your Style: Classic Elegance",
      description: "You're drawn to timeless, sophisticated photography that will never go out of style. You appreciate traditional compositions with a modern touch, elegant portraits, and a refined approach that captures the formality and beauty of your wedding day.",
      sampleImages: [
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/classic-1.jpg",
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/classic-2.jpg",
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/classic-3.jpg"
      ],
      recommendations: [
        "Consider a full-day package to capture all the traditional moments",
        "Plan for formal family portraits after your ceremony",
        "Schedule a bridal portrait session before the wedding day",
        "Allow time for romantic sunset portraits during your reception"
      ]
    },
    natural: {
      style: "Natural & Candid",
      title: "Your Style: Natural & Candid",
      description: "You value authentic, unposed moments that tell the real story of your day. You're drawn to a photojournalistic approach with natural light, genuine emotions, and a relaxed feel that captures the true essence of your relationships and celebration.",
      sampleImages: [
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/natural-1.jpg",
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/natural-2.jpg",
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/natural-3.jpg"
      ],
      recommendations: [
        "Choose a photographer who excels at candid photography",
        "Consider a 'first look' for intimate, genuine reactions",
        "Plan your ceremony time around the best natural light",
        "Allow your photographer freedom to capture moments as they happen"
      ]
    },
    editorial: {
      style: "Editorial & Dramatic",
      title: "Your Style: Editorial & Dramatic",
      description: "You're inspired by bold, magazine-worthy images with a wow factor. You appreciate creative compositions, dramatic lighting, and artistic approaches that transform your wedding photos into striking works of art that stand out from the ordinary.",
      sampleImages: [
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/editorial-1.jpg",
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/editorial-2.jpg",
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/editorial-3.jpg"
      ],
      recommendations: [
        "Schedule additional time for creative portrait sessions",
        "Consider venues with interesting architectural features",
        "Plan for night photography with dramatic lighting",
        "Trust your photographer's creative vision and direction"
      ]
    },
    rustic: {
      style: "Rustic & Romantic",
      title: "Your Style: Rustic & Romantic",
      description: "You're drawn to warm, intimate photography with a touch of nostalgia. You value images that capture the cozy, heartfelt moments of your day with rich tones, organic settings, and an emphasis on the emotional connections between you and your loved ones.",
      sampleImages: [
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/rustic-1.jpg",
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/rustic-2.jpg",
        "https://res.cloudinary.com/dos0qac90/image/upload/q_auto,f_auto,w_600/v1/results/rustic-3.jpg"
      ],
      recommendations: [
        "Choose outdoor or naturally-lit venues when possible",
        "Plan your wedding during 'golden hour' for warm, glowing light",
        "Incorporate personal, meaningful details to photograph",
        "Consider a more intimate guest list to capture close connections"
      ]
    }
  };

  const handleAnswerSelect = (styleChoice: string) => {
    const newAnswers = { ...answers, [currentQuestion]: styleChoice };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResult = (): StyleResult => {
    const styles: Record<string, number> = {
      classic: 0,
      natural: 0,
      editorial: 0,
      rustic: 0
    };
    
    // Count the occurrences of each style in answers
    Object.values(answers).forEach(style => {
      if (style in styles) {
        styles[style]++;
      }
    });
    
    // Find the style with the highest count
    let maxCount = 0;
    let resultStyle = "natural"; // Default
    
    Object.entries(styles).forEach(([style, count]) => {
      if (count > maxCount) {
        maxCount = count;
        resultStyle = style;
      }
    });
    
    return styleResults[resultStyle];
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="wedding-style-quiz-container">
      {!quizStarted ? (
        <div className="quiz-intro">
          <h2>Discover Your Wedding Photography Style</h2>
          <p>Take this quick 5-question quiz to find your perfect wedding photography style and get personalized recommendations for your big day.</p>
          <div className="style-preview">
            <div className="style-preview-item">
              <img src="/images/quiz/preview-classic.jpg" alt="Classic style" />
              <span>Classic</span>
            </div>
            <div className="style-preview-item">
              <img src="/images/quiz/preview-natural.jpg" alt="Natural style" />
              <span>Natural</span>
            </div>
            <div className="style-preview-item">
              <img src="/images/quiz/preview-editorial.jpg" alt="Editorial style" />
              <span>Editorial</span>
            </div>
            <div className="style-preview-item">
              <img src="/images/quiz/preview-rustic.jpg" alt="Rustic style" />
              <span>Rustic</span>
            </div>
          </div>
          <button className="start-quiz-button" onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : showResults ? (
        <div className="quiz-results">
          <h2>{calculateResult().title}</h2>
          <p className="result-description">{calculateResult().description}</p>
          
          <div className="result-images">
            {calculateResult().sampleImages.map((image, index) => (
              <div key={index} className="result-image">
                <img src={image} alt={`${calculateResult().style} style example ${index + 1}`} />
              </div>
            ))}
          </div>
          
          <div className="recommendations">
            <h3>Photography Recommendations</h3>
            <ul>
              {calculateResult().recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
          
          <div className="result-actions">
            <button className="contact-button">Contact Me About This Style</button>
            <button className="retake-button" onClick={resetQuiz}>Retake Quiz</button>
          </div>
        </div>
      ) : (
        <div className="quiz-question">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
              ></div>
            </div>
            <span>Question {currentQuestion + 1} of {questions.length}</span>
          </div>
          
          <h2>{questions[currentQuestion].question}</h2>
          
          <div className="quiz-options">
            {questions[currentQuestion].options.map((option, index) => (
              <div 
                key={index} 
                className="quiz-option"
                onClick={() => handleAnswerSelect(option.style)}
              >
                <div className="option-image">
                  <img src={option.image} alt={option.text} />
                </div>
                <p>{option.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingStyleQuiz;
