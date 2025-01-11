"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Edit, Eye, Lock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const SurveyVersionManager = ({ isAdmin = false }) => {
  // Sample data - in real app would come from props or API
  const [versions] = useState([
    {
      id: 1,
      version: "2.1",
      isActive: true,
      lastUpdated: "2024-01-09",
      questions: [
        {
          id: 1,
          text: "How satisfied are you with our service?",
          type: "multiple_choice",
          serviceSpecific: null,
          options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
        },
        {
          id: 2,
          text: "Did you experience any technical issues?",
          type: "yes_no",
          serviceSpecific: "Technical Support"
        },
        {
          id: 3,
          text: "Would you recommend our service?",
          type: "yes_no",
          serviceSpecific: null
        }
      ]
    },
    {
      id: 2,
      version: "2.0",
      isActive: false,
      lastUpdated: "2023-12-15",
      questions: [
        {
          id: 1,
          text: "Rate your overall experience",
          type: "multiple_choice",
          serviceSpecific: null,
          options: ["Excellent", "Good", "Fair", "Poor"]
        }
      ]
    }
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Survey Versions</CardTitle>
            <CardDescription>
              View and manage different versions of the feedback survey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <Accordion type="single" collapsible>
                {versions.map((version) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AccordionItem value={`version-${version.id}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-medium">
                            Version {version.version}
                          </span>
                          {version.isActive && (
                            <Badge className="bg-green-500">Active</Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            Last updated: {version.lastUpdated}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-6 pt-4">
                          <div className="flex justify-end gap-2">
                            {isAdmin ? (
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Version
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                <Lock className="w-4 h-4 mr-2" />
                                View Only
                              </Button>
                            )}
                          </div>

                          <AnimatePresence>
                            {version.questions.map((question, index) => (
                              <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Card className="mb-4">
                                  <CardContent className="pt-6">
                                    <div className="flex justify-between items-start gap-4">
                                      <div>
                                        <p className="font-medium mb-2">
                                          {question.text}
                                        </p>
                                        <div className="flex gap-2">
                                          <Badge variant="outline">
                                            {question.type === 'multiple_choice'
                                              ? 'Multiple Choice'
                                              : 'Yes/No'}
                                          </Badge>
                                          {question.serviceSpecific && (
                                            <Badge variant="secondary">
                                              {question.serviceSpecific}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-sm text-gray-500">
                                          Question {index + 1}
                                        </span>
                                      </div>
                                    </div>

                                    {question.type === 'multiple_choice' && (
                                      <div className="mt-4">
                                        <p className="text-sm text-gray-500 mb-2">
                                          Options:
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                          {question.options.map((option, idx) => (
                                            <div
                                              key={idx}
                                              className="p-2 bg-gray-50 rounded text-sm"
                                            >
                                              {option}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SurveyVersionManager;