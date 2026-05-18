import { Metadata } from 'next';
import InvitationClient from '@/components/invitation/InvitationClient';
import { notFound } from 'next/navigation';

async function getInvitation(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/invitations/${id}`, {
      next: { revalidate: 60 } // Revalidate every minute
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  // Await the params before using properties from it as required by Next.js 15
  const resolvedParams = await params;
  const invitation = await getInvitation(resolvedParams.id);
  
  if (!invitation) {
    return { title: 'Invitation Not Found' };
  }

  const title = `You're Invited! ${invitation.groom_name} & ${invitation.bride_name}'s Wedding`;
  const description = `Join us in celebrating our wedding on ${new Date(invitation.wedding_date).toLocaleDateString()} at ${invitation.venue}.`;
  
  // Use background image or bride image for Open Graph preview
  const imageUrl = invitation.bg_image || invitation.bride_image || invitation.groom_image;
  const fullImageUrl = imageUrl ? imageUrl : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: fullImageUrl ? [fullImageUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: fullImageUrl ? [fullImageUrl] : [],
    }
  };
}

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params before using properties from it as required by Next.js 15
  const resolvedParams = await params;
  const invitation = await getInvitation(resolvedParams.id);

  if (!invitation) {
    notFound();
  }

  return <InvitationClient data={invitation} />;
}
