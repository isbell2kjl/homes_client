import { Injectable } from '@angular/core';
import { PageContent } from '../models/page-content';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private content: PageContent = {
    siteName: 'My Advantage Properties',
    homeMainTitle: 'Turn Your Dreams Into Reality',
    homeMainText: 'We buy and sell distressed properties in the Puget Sound area to provide opportunites for owners to recover from potential loss and to provide buyers the chance to turn their dream home into reality.',
    homeTagLine: 'A win-win opportunity for home owners and buyers to achieve their goals and provide a facelift to their neighborhoods and communities.',
    homeSub1Title: 'Short Time to Close',
    homeSub1Text: 'As we specialize in cash only transactions for properties in their current "as is" condition, we can typically close on your property within 30-45 days, depending on title status.',
    homeSub2Title: 'Any Condition',
    homeSub2Text: 'We buy properties in any condition. If you are unable to spend the extra time and money to prepare your house for resale, we can make a great offer in its current condition.',
    homeSub3Title: 'Personal Contact',
    homeSub3Text: 'We live and work in the Seattle area and can meet with you personally to address your concerns and negotiate offers that make sense for you.',
    contactText: 'My name is Keith Isbell and I live and work in the Seattle area. I look forward to providing opportunties to revitalize distressed properties in local neighborhoods. Please contact me with any questions.',
    contactEmail: 'myadvantagep@gmail.com',
    contactPhone: '206-571-7023'
  };

  getPageContent(): PageContent {
    return this.content;
  }

  updatePageContent(updatedContent: PageContent): void {
    this.content = updatedContent;
  }

}
