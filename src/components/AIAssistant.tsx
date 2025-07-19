import React, { useState } from 'react';
import { AISuggestion } from '../types/invoice';
import { Bot, AlertTriangle, Lightbulb, Shield, Palette, TrendingUp, X, Check, Settings } from 'lucide-react';

interface AIAssistantProps {
  suggestions: AISuggestion[];
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ suggestions, enabled, onToggle }) => {
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const getIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5" />;
      case 'optimization':
        return <TrendingUp className="w-5 h-5" />;
      case 'tax':
        return <Shield className="w-5 h-5" />;
      case 'formatting':
        return <Palette className="w-5 h-5" />;
      case 'compliance':
        return <Shield className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getColor = (type: AISuggestion['type'], severity: AISuggestion['severity']) => {
    if (type === 'error') {
      return severity === 'high' 
        ? 'text-red-700 bg-red-50 border-red-200'
        : 'text-red-600 bg-red-50 border-red-200';
    }
    
    switch (type) {
      case 'optimization':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'tax':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'formatting':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'compliance':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadge = (severity: AISuggestion['severity']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[severity]}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  const dismissSuggestion = (index: number) => {
    setDismissedSuggestions(prev => new Set([...prev, index.toString()]));
  };

  const activeSuggestions = suggestions.filter((_, index) => 
    !dismissedSuggestions.has(index.toString())
  );

  const errorCount = activeSuggestions.filter(s => s.type === 'error').length;
  const highPriorityCount = activeSuggestions.filter(s => s.severity === 'high').length;

  if (!enabled) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bot className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <button
            onClick={() => onToggle(true)}
            className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-4 h-4 mr-1" />
            Enable
          </button>
        </div>
        <div className="text-center py-8">
          <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">AI Assistant is disabled</p>
          <p className="text-sm text-gray-400 mt-1">Enable to get intelligent suggestions and error detection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bot className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          {(errorCount > 0 || highPriorityCount > 0) && (
            <div className="flex items-center ml-3 space-x-2">
              {errorCount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  {errorCount} error{errorCount !== 1 ? 's' : ''}
                </span>
              )}
              {highPriorityCount > 0 && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {highPriorityCount} high priority
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => onToggle(false)}
          className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
        >
          <Settings className="w-4 h-4 mr-1" />
          Disable
        </button>
      </div>

      {activeSuggestions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 font-medium">Excellent work!</p>
          <p className="text-sm text-gray-500 mt-1">Your invoice looks professional and complete.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${getColor(suggestion.type, suggestion.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className="mr-3 mt-0.5">
                    {getIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <div className="flex items-center space-x-2">
                        {getSeverityBadge(suggestion.severity)}
                        <button
                          onClick={() => dismissSuggestion(index)}
                          className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm opacity-90 mb-3">{suggestion.description}</p>
                    {suggestion.action && (
                      <button
                        onClick={suggestion.action}
                        className="inline-flex items-center px-3 py-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded text-sm font-medium transition-colors"
                      >
                        {suggestion.autoFix ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Auto Fix
                          </>
                        ) : (
                          'Apply Suggestion'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSuggestions.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 AI suggestions help improve invoice quality and compliance
          </p>
        </div>
      )}
    </div>
  );
};