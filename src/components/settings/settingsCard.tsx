"use client";

import { useState } from 'react'
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Paintbrush, Code, FileText, CheckSquare, Database, ChevronDown } from 'lucide-react'

type Member = {
  name: string
  avatar: string
}

type CardData = {
  id: string
  title: string
  description: string
  assignedTo: Member[]
  progress: number
  updatedDate: string
  checkedBy: string
  updatedBy: string
  details: string[]
}

const TaskCard = ({ data, type, href }: { data: CardData; type: 'design' | 'code' | 'doc' | 'qa' | 'db' | 'back'; href: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getIcon = () => {
    switch (type) {
      case 'design': return <Paintbrush className="h-6 w-6 text-purple-500" />
      case 'code': return <Code className="h-6 w-6 text-blue-500" />
      case 'doc': return <FileText className="h-6 w-6 text-green-500" />
      case 'qa': return <CheckSquare className="h-6 w-6 text-red-500" />
      case 'db': return <Database className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <Card className="w-full">
      <Link href={href}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">{data.title}</CardTitle>
            {getIcon()}
          </div>
          <CardDescription>{data.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <span className="text-sm font-medium mr-2">Assigned to:</span>
            <div className="flex -space-x-2">
              {data.assignedTo.map((member, index) => (
                <Avatar key={index} className="border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{data.progress}%</span>
            </div>
            <Progress value={data.progress} className="w-full" />
          </div>
        </CardContent>
        <div className="text-sm text-muted-foreground px-6">
          <p>Updated: {data.updatedDate}</p>
          <p>Checked by: {data.checkedBy}</p>
          <p>Updated by: {data.updatedBy}</p>
        </div>
      </Link>
      <CardFooter className="flex flex-col items-start">
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="details">
            <AccordionTrigger
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full"
            >
              <span>View Details</span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside">
                {data.details.map((detail, index) => (
                  <li key={index} className="text-sm">{detail}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  )
}

const DesignSVG = () => (
  <svg className="w-full h-32" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="10" width="360" height="80" rx="10" fill="#f3e8ff" />
    <circle cx="50" cy="50" r="20" fill="#d8b4fe" />
    <rect x="90" y="40" width="80" height="20" rx="5" fill="#a855f7" />
    <path d="M160 70 L180 70 L170 90 Z" fill="#7e22ce" />
  </svg>
)

const CodeSVG = () => (
  <svg className="w-full h-32" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="360" height="80" rx="10" fill="#e0f2fe" />
    <path d="M40 40 L60 60 L40 80" stroke="#0284c7" strokeWidth="4" fill="none" />
    <path d="M80 40 L100 60 L80 80" stroke="#0284c7" strokeWidth="4" fill="none" />
    <rect x="120" y="50" width="40" height="20" rx="5" fill="#0ea5e9" />
    <circle cx="180" cy="30" r="10" fill="#38bdf8" />
  </svg>
)

const BackSVG = () => (
  <svg className="w-full h-32" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="360" height="80" rx="10" fill="#e0f2fe"/>
    <ellipse cx="40" cy="40" rx="15" ry="5" fill="#4ade80"/>
    <rect x="25" y="40" width="30" height="20" fill="#4ade80"/>
    <ellipse cx="40" cy="60" rx="15" ry="5" fill="#22c55e"/>
    <rect x="80" y="30" width="40" height="5" rx="2" fill="#4ade80"/>
    <rect x="80" y="40" width="40" height="5" rx="2" fill="#22c55e"/>
    <rect x="80" y="50" width="40" height="5" rx="2" fill="#4ade80"/>
    <rect x="80" y="60" width="40" height="5" rx="2" fill="#22c55e"/>
    <path d="M140 30 L150 50 L140 70" stroke="#4ade80" strokeWidth="4" fill="none"/>
    <path d="M160 30 L170 50 L160 70" stroke="#22c55e" strokeWidth="4" fill="none"/>
    <circle cx="180" cy="30" r="8" fill="#4ade80">
      <animate attributeName="fill" values="#4ade80;#22c55e;#4ade80" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
)

const DocSVG = () => (
  <svg className="w-full h-32" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="360" height="80" rx="10" fill="#dcfce7" />
    <rect x="30" y="30" width="140" height="10" rx="2" fill="#22c55e" />
    <rect x="30" y="50" width="100" height="10" rx="2" fill="#22c55e" />
    <rect x="30" y="70" width="120" height="10" rx="2" fill="#22c55e" />
    <circle cx="180" cy="20" r="10" fill="#4ade80" />
  </svg>
)

const QASVG = () => (
  <svg className="w-full h-32" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="360" height="80" rx="10" fill="#fee2e2" />
    <path d="M40 50 L60 70 L100 30" stroke="#dc2626" strokeWidth="4" fill="none" />
    <circle cx="140" cy="50" r="20" fill="#ef4444" />
    <path d="M135 45 L145 55 M145 45 L135 55" stroke="white" strokeWidth="2" />
  </svg>
)

const DBSVG = () => (
  <svg className="w-full h-32" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="360" height="80" rx="10" fill="#fef3c7" />
    <ellipse cx="100" cy="30" rx="60" ry="15" fill="#fbbf24" />
    <ellipse cx="100" cy="50" rx="60" ry="15" fill="#f59e0b" />
    <ellipse cx="100" cy="70" rx="60" ry="15" fill="#d97706" />
  </svg>
)

export default function SettingsCard() {
  const cardsData: { data: CardData; type: 'design' | 'code' | 'doc' | 'qa' | 'db' | 'back'; href: string }[] = [
    {
      data: {
        id: '1',
        title: 'Website UI Designer',
        description: 'Revamp the company website with a modern look',
        assignedTo: [
          { name: 'Mack Rafanan', avatar: '/placeholder.svg?height=32&width=32' },
        ],
        progress: 75,
        updatedDate: '2023-05-15',
        checkedBy: 'John Esternon',
        updatedBy: 'Mack Rafanan',
        details: [
          'Define the color palette',
          'Design responsive layouts',
          'Prepare mockups for client review',
        ],
      },
      type: 'design',
      href: '/settings/designer'
    },
    {
      data: {
        id: '2',
        title: 'Frontend API Development',
        description: 'Develop RESTful API for the new mobile app',
        assignedTo: [
          { name: 'Maverick Rosales', avatar: '/placeholder.svg?height=32&width=32' },
        ],
        progress: 60,
        updatedDate: '2023-05-14',
        checkedBy: 'John Esternon',
        updatedBy: 'Maverick Rosales',
        details: [
          'Use codes to make the website amazing',
        ],
      },
      type: 'code',
      href: 'settings/frontend'
    },
    {
      data: {
        id: '3',
        title: 'Document and Manuals',
        description: 'Create comprehensive user manual for the new software',
        assignedTo: [
          { name: 'Stephanie Cruz', avatar: '/placeholder.svg?height=32&width=32' },
        ],
        progress: 40,
        updatedDate: '2023-05-16',
        checkedBy: 'John Esternon',
        updatedBy: 'Stephanie Cruz',
        details: [
          'Outline manual structure',
          'Write installation guide',
          'Document all features',
        ],
      },
      type: 'doc',
      href: '/documentation'
    },
    // {
    //   data: {
    //     id: '4',
    //     title: 'Quality Assurance Tester',
    //     description: 'Perform thorough testing of the new software release',
    //     assignedTo: [
    //       { name: 'Mike', avatar: '/placeholder.svg?height=32&width=32' },
    //       { name: 'Nina', avatar: '/placeholder.svg?height=32&width=32' },
    //       { name: 'Oscar', avatar: '/placeholder.svg?height=32&width=32' },
    //     ],
    //     progress: 80,
    //     updatedDate: '2023-05-17',
    //     checkedBy: 'Patty',
    //     updatedBy: 'Mike',
    //     details: [
    //       'Create test plans',
    //       'Execute functional tests',
    //       'Perform regression testing',
    //       'Report and track bugs',
    //       'Validate bug fixes',
    //     ],
    //   },
    //   type: 'qa',
    //   href: '/qa'
    // },
    // {
    //   data: {
    //     id: '5',
    //     title: 'Database Administrator',
    //     description: 'Optimize database performance for improved app speed',
    //     assignedTo: [
    //       { name: 'Quinn', avatar: '/placeholder.svg?height=32&width=32' },
    //       { name: 'Rachel', avatar: '/placeholder.svg?height=32&width=32' },
    //     ],
    //     progress: 55,
    //     updatedDate: '2023-05-18',
    //     checkedBy: 'Sam',
    //     updatedBy: 'Quinn',
    //     details: [
    //       'Analyze current database performance',
    //       'Identify bottlenecks',
    //       'Optimize database queries',
    //       'Implement indexing strategies',
    //       'Monitor and fine-tune performance',
    //     ],
    //   },
    //   type: 'db',
    //   href: '/database'
    // },
    // {
    //   data: {
    //     id: '6',
    //     title: 'Backend Developer',
    //     description: 'Design user interface for the new mobile application',
    //     assignedTo: [
    //       { name: 'Tom', avatar: '/placeholder.svg?height=32&width=32' },
    //       { name: 'Uma', avatar: '/placeholder.svg?height=32&width=32' },
    //       { name: 'Victor', avatar: '/placeholder.svg?height=32&width=32' },
    //     ],
    //     progress: 90,
    //     updatedDate: '2023-05-19',
    //     checkedBy: 'Wendy',
    //     updatedBy: 'Tom',
    //     details: [
    //       'Create wireframes',
    //       'Design UI components',
    //       'Develop color scheme',
    //       'Create interactive prototypes',
    //       'Conduct user testing',
    //     ],
    //   },
    //   type: 'back',
    //   href: '/backend'
    // },
  ]

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cardsData.map((card, index) => (
          <div key={card.data.id} className="flex flex-col">
            <Link href={card.href}>
              {card.type === 'design' && <DesignSVG />}
              {card.type === 'code' && <CodeSVG />}
              {card.type === 'doc' && <DocSVG />}
              {card.type === 'qa' && <QASVG />}
              {card.type === 'db' && <DBSVG />}
              {card.type === 'back' && <BackSVG />}
            </Link>
            <TaskCard 
              data={card.data} 
              type={card.type} 
              href={card.href}
            />
          </div>
        ))}
      </div>
    </div>
  )
}