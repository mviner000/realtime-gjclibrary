'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from '@/components/ui/progress'
import { ClipboardList } from 'lucide-react'
import Terms from './Terms'
import UploadAvatarPicture from './UploadAvatar'

const ONBOARD_NEXT_API_URL = "/api/onboard/";

export default function Onboarding() {
    const [step, setStep] = useState(1)
    const [agreed, setAgreed] = useState(false)
    const [isAvatarUploaded, setIsAvatarUploaded] = useState(false) // Track if avatar upload is successful
    const [isLoading, setIsLoading] = useState(false) // Track the loading state

    const totalSteps = 3

    const handleNextStep = () => {
        if (step < totalSteps) {
            setStep(step + 1)
        }
    }

    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const handleFinish = async () => {
        setIsLoading(true); // Set loading to true
        try {
            const response = await fetch(ONBOARD_NEXT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Failed to complete onboarding');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setIsLoading(false); // Set loading to false once the request is complete
        }
    };

    return (
        <div className="flex">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Welcome to Your College Library</CardTitle>
                    <CardDescription>Let us get you started with your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Progress value={(step / totalSteps) * 100} className="mb-4" />
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold"></h3>
                            <div className="h-40 overflow-y-auto border p-2 rounded">
                                <Terms />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)} />
                                <Label htmlFor="terms">I agree to the terms of service</Label>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Set Your Avatar</h3>
                            <div className="flex flex-col items-center space-y-4">
                                <UploadAvatarPicture
                                    onUploadComplete={(result, error) => {
                                        if (error) {
                                            console.error("Upload failed:", error);
                                            setIsAvatarUploaded(false); // Disable the next button on failure
                                        } else if (result) {
                                            console.log("Upload succeeded:", result);
                                            setIsAvatarUploaded(true); // Enable the next button on success
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Library Visit Logs</h3>
                            <p>You can view all your visits to the physical library, including:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Date and time of each visit</li>
                                <li>Purpose of your visit</li>
                                <li>Books borrowed or returned</li>
                                <li>Study room reservations</li>
                            </ul>
                            <ClipboardList className="w-12 h-12 mx-auto text-primary" />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button className='bg-customGreen2 hover:bg-customGreen2/90' onClick={handlePrevStep} disabled={step === 1}>Previous</Button>
                    {step < totalSteps ? (
                        <Button className='bg-customGreen2 hover:bg-customGreen2/90' onClick={handleNextStep} disabled={(step === 1 && !agreed) || (step === 2 && !isAvatarUploaded)}>
                            Next
                        </Button>
                    ) : (
                        <Button className='bg-customGreen2 hover:bg-customGreen2/90' onClick={handleFinish} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Finish'}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
