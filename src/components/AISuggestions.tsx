import React from 'react';
import { AISuggestion } from '../types/invoice';
import { Lightbulb, Zap, TrendingUp, FileText } from 'lucide-react';

interface AISuggestionsProps {
  suggestions: AISuggestion[];
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions }) => {
  const getIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'item':
        return <FileText className="w-5 h-5" />;
      case 'client':
        return <TrendingUp className="w-5 h-5" />;
      case 'terms':
        return <Zap className="w-5 h-5" />;
      case 'optimization':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'item':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'client':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'terms':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'optimization':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">Great job! Your invoice looks complete.</p>
          <p className="text-sm text-gray-500 mt-1">Keep adding items to get more AI suggestions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {suggestions.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${getColor(suggestion.type)}`}
            onClick={suggestion.action}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                {getIcon(suggestion.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">{suggestion.title}</h4>
                <p className="text-sm opacity-80">{suggestion.description}</p>
              </div>
              <div className="ml-2">
                <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                  Click to apply
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};