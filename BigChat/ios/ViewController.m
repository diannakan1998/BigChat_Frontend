// Add this to the header of your file, e.g. in ViewController.m
#import "ViewController.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

// Add this to the body
@implementation ViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  FBSDKLoginButton *loginButton = [[FBSDKLoginButton alloc] init];
  // Optional: Place the button in the center of your view.
  loginButton.center = self.view.center;
  [self.view addSubview:loginButton];
}

@end

