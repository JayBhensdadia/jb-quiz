import { CustomButton } from '@/components/ui/CustomButton';
import { db } from '@/db/client';
import { answers, options, SelectAnswer, SelectOption, SelectQuestion, users } from '@/db/schema';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const UserQuiz = () => {
    const { userId } = useLocalSearchParams();



    console.log('user_id: ', userId);

    if (!userId) {
        return <View>
            <Text>please provide id!</Text>
        </View>;
    }

    const currentId = Array.isArray(userId) ? userId[0] : userId;


    const [questionList, setQuestionList] = useState<SelectQuestion[] | null | undefined>(null);
    const [answerList, setAnswerList] = useState<SelectAnswer[] | null | undefined>(null);
    const [optionList, setOptionList] = useState<SelectOption[] | null | undefined>(null);


    // const questionsList = useLiveQuery(db.query.questions.findMany());
    // const answersList = useLiveQuery(db.query.answers.findMany({ where: eq(answers.userId, parseInt(currentId)) }));
    // const optionsList = useLiveQuery(db.query.options.findMany());
    // const playedQuiz = useLiveQuery(db.query.quizResults.findMany());


    const [loading, setLoading] = useState(true);

    const [quizQuestions, setQuizQuestions] = useState<SelectQuestion[] | null | undefined>(null);
    const [currentQuestion, setCurrentQuestion] = useState<SelectQuestion | null | undefined>(null);

    const [isAttempted, setIsAttempted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null | undefined>(null);


    useEffect(() => {


        const loadData = async () => {

            const tempQuestions = await db.query.questions.findMany();
            const tempAnswers = await db.query.answers.findMany({ where: eq(answers.userId, parseInt(currentId)) });
            // const tempOptions = await db.query.options.findMany();


            setQuestionList(tempQuestions);
            setAnswerList(tempAnswers);


        };

        loadData();

    }, []);


    // useEffect(() => {


    //     if (questionList && answerList) {

    //         let questionArray: SelectQuestion[] = [...questionList];

    //         for (let i = 0; i < answerList.length; i++) {
    //             questionArray.splice(answerList[i].questionId, 1);

    //         }

    //         setQuizQuestions(questionArray);

    //         // setLoading(false);
    //     }



    // }, [questionList, answerList]);

    useEffect(() => {
        if (questionList && answerList) {
            const answeredQuestionIds = new Set(answerList.map(answer => answer.questionId));
            const filteredQuestions = questionList.filter(question => !answeredQuestionIds.has(question.id));

            setQuizQuestions(filteredQuestions);
        }
    }, [questionList, answerList]);


    useEffect(() => {
        if (quizQuestions) {
            setCurrentQuestion(quizQuestions[0]);
            // setLoading(false);
        }
    }, [quizQuestions]);


    useEffect(() => {

        const load = async () => {

            if (currentQuestion) {
                try {
                    const tempOptions = await db.query.options.findMany({ where: eq(options.questionId, currentQuestion.id) });
                    setOptionList(tempOptions);

                    setLoading(false);

                } catch (error) {
                    console.log(error);
                    alert("error in loading options for current question");

                }
            }
        };


        load();


    }, [currentQuestion]);




    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading.....</Text>
        </View>;
    }


    if (quizQuestions?.length == 0) {

        router.replace("/");

        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Quiz completed!</Text>
        </View>;
    }



    return (
        <View style={{ flex: 1, marginTop: 50 }}>

            {/* <Text>User {currentId} Quiz page</Text>

          
            <Text>{JSON.stringify(currentQuestion)}</Text>
            <Text>{JSON.stringify(optionList)}</Text> */}


            {/* <Text>{JSON.stringify(quizQuestions)}</Text> */}




            <View style={{ flex: 1, borderWidth: 1, padding: 10, margin: 20, marginBottom: 50, borderColor: 'gray', borderRadius: 20 }}>

                <View>
                    <Text style={{ fontFamily: 'Space-Grotesk', fontSize: 20 }}>{currentQuestion?.questionText}</Text>
                </View>

                {/* options */}
                <View style={{ flex: 1, display: 'flex', gap: 10, marginVertical: 30 }}>

                    {/* <Text>{JSON.stringify(optionsList.data)}</Text> */}

                    {optionList!.map((option) => {
                        return <Pressable key={option.id} onPress={() => {

                            setSelectedOption(option);
                            setIsAttempted(prev => !prev);


                        }} disabled={isAttempted} >

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderRadius: 20, borderColor: 'gray' }}>


                                <Text style={[{ fontFamily: 'Space-Grotesk', fontSize: 16 }, (selectedOption && (selectedOption.id === option.id && option.isCorrect)) && { color: 'green', fontFamily: 'Space-Grotesk-Bold' }, (selectedOption && (selectedOption.id === option.id && !option.isCorrect)) && { color: 'red' }]}>{option.content}</Text>


                            </View>

                        </Pressable>;
                    })}
                </View>


                {selectedOption && <CustomButton varient='outline' title='next' onPress={async () => {

                    console.log('next pressed!!!');


                    try {

                        await db.insert(answers).values({ userId: parseInt(currentId), questionId: currentQuestion!.id, optionId: selectedOption.id, isCorrect: selectedOption.isCorrect });

                        setIsAttempted(false);


                        setQuizQuestions(prev => {
                            if (prev) {
                                const temp = [...prev];
                                temp.shift();
                                return temp;
                            }
                            return prev;  // Return the previous state if it's null or undefined
                        });


                    } catch (error) {
                        console.log(error);
                        alert('error in submitting response!!');
                    }



                }} />}
            </View>

        </View>

    );
};

export default UserQuiz;