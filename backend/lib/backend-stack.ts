import * as cdk from '@aws-cdk/core';
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // create a bucket to upload your app files

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      versioned: true,
    });

    // create a CDN to deploy your website
    
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
      },
      defaultRootObject: "index.html",
    });

    // Prints out the web endpoint to the terminal

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.domainName,
    });

    // housekeeping for uploading the data in bucket 

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("../frontend/public")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
    
  }
}
